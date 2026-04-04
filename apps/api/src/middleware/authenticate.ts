import type { NextFunction, Request, Response } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { AppError } from './error-handler'

export type AuthRequest = Request & {
  user?: {
    userId: string
    email: string
  }
  params: Record<string, string>
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401)
    }

    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token)
    req.user = payload
    next()
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Invalid or expired token', 401))
  }
}
