import { Router } from 'express'
import { authenticate } from '../../middleware/authenticate'
import { validate } from '../../middleware/validate'
import { taskController } from './task.controller'
import {
  createTaskSchema,
  taskParamsSchema,
  taskQuerySchema,
  updateTaskSchema,
} from './task.schema'

export const taskRouter = Router()

taskRouter.post('/', authenticate, validate(createTaskSchema), taskController.createTask)
taskRouter.get('/', authenticate, validate(taskQuerySchema, 'query'), taskController.getTasks)
taskRouter.get(
  '/:id',
  authenticate,
  validate(taskParamsSchema, 'params'),
  taskController.getTaskById
)
taskRouter.patch(
  '/:id',
  authenticate,
  validate(taskParamsSchema, 'params'),
  validate(updateTaskSchema),
  taskController.updateTaskById
)
taskRouter.delete(
  '/:id',
  authenticate,
  validate(taskParamsSchema, 'params'),
  taskController.deleteTaskById
)
taskRouter.patch(
  '/:id/toggle',
  authenticate,
  validate(taskParamsSchema, 'params'),
  taskController.toggleTaskById
)
