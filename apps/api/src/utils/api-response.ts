import type { Response } from 'express'

export const sendSuccess = <T>(res: Response, data: T, message?: string, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data, message })
}

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors?: Record<string, string[]>
) => {
  return res.status(statusCode).json({ success: false, message, errors })
}
