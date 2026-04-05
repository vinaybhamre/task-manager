import {
  createTask,
  deleteTaskById,
  getAllTasks,
  toggleTaskById,
  updateTaskById,
} from '@/lib/api/tasks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const taskKeys = {
  all: ['tasks'] as const,
  list: (filters: object) => ['tasks', filters] as const,
}

export function useTasks(filters?: {
  status?: string
  search?: string
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: taskKeys.list(filters ?? {}),
    queryFn: () => getAllTasks(filters),
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      toast.success('Task created successfully')
    },
    onError: () => toast.error('Failed to create task'),
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateTaskById>[1] }) =>
      updateTaskById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      toast.success('Task updated successfully')
    },
    onError: () => toast.error('Failed to update task'),
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTaskById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      toast.success('Task deleted successfully')
    },
    onError: () => toast.error('Failed to delete task'),
  })
}

export function useToggleTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleTaskById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all })
      toast.success('Task status updated')
    },
    onError: () => toast.error('Failed to toggle task'),
  })
}
