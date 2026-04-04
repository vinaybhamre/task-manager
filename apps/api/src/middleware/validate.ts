import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

export const validate =
  (schema: ZodType, target: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(
      target === 'query' ? req.query : target === 'params' ? req.params : req.body
    )

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      })
    }

    if (target === 'query') Object.assign(req.query, result.data as Record<string, string>)
    else if (target === 'params') Object.assign(req.params, result.data as Record<string, string>)
    else req.body = result.data

    next()
  }
