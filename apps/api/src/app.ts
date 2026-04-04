import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { env } from './config/env'
import { errorHandler } from './middleware/error-handler'
import { authRouter } from './modules/auth/auth.routes'
import { taskRouter } from './modules/task/task.routes'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())

app.get('/health', (_, res) => {
  res.send({ status: 'Ok' })
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/tasks', taskRouter)

app.use(errorHandler)

export { app }
