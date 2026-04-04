import { NextFunction, Response } from 'express'
import type { AuthRequest } from '../../middleware/authenticate'
import { sendSuccess } from '../../utils/api-response'
import { TaskQueryInput } from './task.schema'
import { taskService } from './task.service'

export const taskController = {
  async createTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const task = await taskService.createTask(userId, req.body)

      sendSuccess(res, task, 'Task created successfully', 201)
    } catch (error) {
      next(error)
    }
  },

  async getTasks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId
      const tasks = await taskService.getTasks(userId, req.query as TaskQueryInput)
      sendSuccess(res, tasks)
    } catch (error) {
      next(error)
    }
  },

  async getTaskById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.id
      const userId = req.user!.userId
      const task = await taskService.getTaskById(userId, taskId)
      sendSuccess(res, task)
    } catch (error) {
      next(error)
    }
  },

  async updateTaskById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.id
      const userId = req.user!.userId
      const task = await taskService.updateTaskById(userId, taskId, req.body)
      sendSuccess(res, task, 'Task updated successfully')
    } catch (error) {
      next(error)
    }
  },

  async deleteTaskById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.id
      const userId = req.user!.userId
      await taskService.deleteTaskById(userId, taskId)
      sendSuccess(res, null, 'Task deleted successfully')
    } catch (error) {
      next(error)
    }
  },
  async toggleTaskById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const taskId = req.params.id
      const userId = req.user!.userId
      const task = await taskService.toggleTaskById(userId, taskId)
      sendSuccess(res, task)
    } catch (error) {
      next(error)
    }
  },
}
