import { prisma } from '../../lib/prisma'
import { AppError } from '../../middleware/error-handler'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt'
import { comparePassword, hashPassword } from '../../utils/password'
import { LoginInput, RegisterInput } from './auth.schema'

const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

// Register Service
async function register(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } })

  if (existingUser) {
    throw new AppError('Email already in use', 409)
  }

  const passwordHash = await hashPassword(input.password)

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  })

  const accessToken = signAccessToken({ userId: user.id, email: user.email })
  const refreshToken = signRefreshToken({ userId: user.id, email: user.email })

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    },
  })

  return { user, accessToken, refreshToken }
}

// Login Service
async function login(input: LoginInput) {
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } })

  if (!existingUser) {
    throw new AppError('Invalid credentials', 401)
  }

  const isValidPassword = await comparePassword(input.password, existingUser.passwordHash)

  if (!isValidPassword) {
    throw new AppError('Invalid credentials', 401)
  }

  const accessToken = signAccessToken({ userId: existingUser.id, email: existingUser.email })
  const refreshToken = signRefreshToken({ userId: existingUser.id, email: existingUser.email })

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: existingUser.id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    },
  })

  return {
    user: {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      createdAt: existingUser.createdAt,
    },
    accessToken,
    refreshToken,
  }
}

// Logout Service
async function logout(token: string) {
  await prisma.refreshToken.deleteMany({
    where: { token },
  })
}

// Refresh Token
async function refresh(token: string) {
  const stored = await prisma.refreshToken.findUnique({ where: { token }, include: { user: true } })

  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401)
  }

  const payload = verifyRefreshToken(token)
  const accessToken = signAccessToken({ userId: payload.userId, email: payload.email })

  return { accessToken }
}

export const authService = { register, login, logout, refresh }
