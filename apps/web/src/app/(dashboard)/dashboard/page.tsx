'use client'

import TaskCard from '@/components/dashboard/task-card'
import TaskFilters from '@/components/dashboard/task-filters'
import TaskModal from '@/components/dashboard/task-modal'
import { Button } from '@/components/ui/button'
import { useTasks } from '@/hooks/use-tasks'
import { PlusIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const filters = {
    status: searchParams.get('status') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
  }

  const { data, isLoading, isError } = useTasks(filters)

  function handleEdit(task: Task) {
    setEditingTask(task)
    setModalOpen(true)
  }

  function handleCloseModal() {
    setModalOpen(false)
    setEditingTask(undefined)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <Button onClick={() => setModalOpen(true)} className="text-xl p-5 cursor-pointer">
          <PlusIcon />
          Add Task
        </Button>
      </div>

      <TaskFilters />

      {isLoading && <div className="text-center py-12 text-muted-foreground">Loading tasks...</div>}

      {isError && (
        <div className="text-center py-12 text-destructive">
          Failed to load tasks. Please try again.
        </div>
      )}

      {!isLoading && !isError && data?.tasks?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No tasks found. Create your first task!
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.tasks?.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={handleEdit} />
        ))}
      </div>

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: data.meta.totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={filters.page === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('page', String(page))
                router.push(`?${params.toString()}`)
              }}
            >
              {page}
            </Button>
          ))}
        </div>
      )}

      <TaskModal open={modalOpen} onClose={handleCloseModal} task={editingTask} />
    </div>
  )
}
