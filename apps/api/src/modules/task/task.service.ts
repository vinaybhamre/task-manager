import { Prisma } from '.prisma/client'
import { prisma } from '../../lib/prisma'
import { AppError } from '../../middleware/error-handler'
import { CreateTaskInput, TaskQueryInput, UpdateTaskInput } from './task.schema'

const STATUS_CYCLE = {
  TODO: 'IN_PROGRESS',
  IN_PROGRESS: 'DONE',
  DONE: 'TODO',
} as const

async function createTask(userId: string, input: CreateTaskInput) {
  const task = await prisma.task.create({
    data: {
      ...input,
      userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return { task }
}

async function getTasks(userId: string, query: TaskQueryInput) {
  const where = {
    userId,
    ...(query.status && { status: query.status }),
    ...(query.search && {
      title: {
        contains: query.search,
        mode: 'insensitive' as Prisma.QueryMode,
      },
    }),
  }

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const skip = (page - 1) * limit

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.task.count({ where }),
  ])

  return { tasks, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
}

async function getTaskById(userId: string, taskId: string) {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  })

  if (!task) {
    throw new AppError('Task not found', 404)
  }

  if (task.userId !== userId) {
    throw new AppError('Forbidden', 403)
  }

  const { userId: _, ...taskWithOutUserId } = task

  return { task: taskWithOutUserId }
}

async function updateTaskById(userId: string, taskId: string, input: UpdateTaskInput) {
  const { task } = await getTaskById(userId, taskId)

  const updatedTask = await prisma.task.update({
    data: {
      ...input,
    },
    where: {
      id: task.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return { task: updatedTask }
}

async function deleteTaskById(userId: string, taskId: string) {
  const { task } = await getTaskById(userId, taskId)

  await prisma.task.delete({
    where: {
      id: task.id,
    },
  })

  return { message: 'Task deleted successfully' }
}

async function toggleTaskById(userId: string, taskId: string) {
  const { task } = await getTaskById(userId, taskId)

  const updatedTask = await prisma.task.update({
    data: {
      status: STATUS_CYCLE[task.status],
    },
    where: {
      id: task.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      dueDate: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return { task: updatedTask }
}

export const taskService = {
  createTask,
  getTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  toggleTaskById,
}
