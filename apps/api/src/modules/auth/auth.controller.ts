import { NextFunction, Request, Response } from 'express'
import { sendSuccess } from '../../utils/api-response'
import { authService } from './auth.service'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } = await authService.register(req.body)

      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)

      sendSuccess(res, { user, accessToken }, 'Registration successful', 201)
    } catch (error) {
      next(error)
    }
  },
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } = await authService.login(req.body)

      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS)

      sendSuccess(res, { user, accessToken }, 'Login successful')
    } catch (error) {
      next(error)
    }
  },
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken
      if (token) await authService.logout(token)
      res.clearCookie('refreshToken')
      sendSuccess(res, null, 'Logged out successfully')
    } catch (error) {
      next(error)
    }
  },
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.refreshToken
      if (!token) {
        return res.status(401).json({ success: false, message: 'No refresh token' })
      }
      const { accessToken } = await authService.refresh(token)

      sendSuccess(res, { accessToken })
    } catch (error) {
      next(error)
    }
  },
}
