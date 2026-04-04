import { api } from './client'

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

type TaskResponse = {
  data: {
    task: Task
  }
}

type TasksResponse = {
  data: {
    tasks: TaskResponse['data']['task'][]
    meta: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export const createTask = async (body: {
  title: string
  description?: string
  status?: string
  dueDate?: string
}) => {
  const response = await api.post<TaskResponse>('/tasks', body)
  return response.data.task
}

export const getAllTasks = async (params?: {
  status?: string
  search?: string
  page?: number
  limit?: number
}) => {
  const response = await api.get<TasksResponse>('/tasks', { params })
  return response.data.tasks
}

export const getTaskById = async (taskId: string) => {
  const response = await api.get<TaskResponse>(`/tasks/${taskId}`)
  return response.data.task
}

export const updateTaskById = async (
  taskId: string,
  body: {
    title: string
    description?: string
    status?: string
    dueDate?: string
  }
) => {
  const response = await api.patch<TaskResponse>(`/tasks/${taskId}`, body)
  return response.data.task
}

export const deleteTaskById = async (taskId: string) => {
  await api.delete(`/tasks/${taskId}`)
}

export const toggleTaskById = async (taskId: string) => {
  const response = await api.patch<TaskResponse>(`/tasks/${taskId}/toggle`, {})
  return response.data.task
}
