'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import TaskForm from './task-form'

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  dueDate: string | null
}

export default function TaskModal({
  open,
  onClose,
  task,
}: {
  open: boolean
  onClose: () => void
  task?: Task
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
          <DialogDescription>Fill in the details below to create a new task.</DialogDescription>
        </DialogHeader>
        <TaskForm task={task} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  )
}
