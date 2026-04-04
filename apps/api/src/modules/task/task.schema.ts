import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50, 'Title cannot exceed 50 characters'),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
  dueDate: z.coerce.date().optional(),
})

export const updateTaskSchema = createTaskSchema.partial()

export const taskQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  search: z.string().optional(),
})

export const taskParamsSchema = z.object({
  id: z.string().min(1, 'Task ID is required'),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type TaskQueryInput = z.infer<typeof taskQuerySchema>
