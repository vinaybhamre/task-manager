'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDeleteTask, useToggleTask } from '@/hooks/use-tasks'
import { Pencil, RefreshCw, Trash2 } from 'lucide-react'

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

const STATUS_COLORS: Record<string, 'default' | 'secondary' | 'destructive'> = {
  TODO: 'secondary',
  IN_PROGRESS: 'default',
  DONE: 'destructive',
}

export default function TaskCard({ task, onEdit }: { task: Task; onEdit: (task: Task) => void }) {
  const { mutate: toggleTask } = useToggleTask()
  const { mutate: deleteTask } = useDeleteTask()

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <CardTitle className="text-base">{task.title}</CardTitle>
        <div className="flex gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
        <div className="flex items-center justify-between">
          <Badge
            variant={STATUS_COLORS[task.status]}
            className="cursor-pointer flex items-center gap-1 p-3"
            onClick={() => toggleTask(task.id)}
          >
            {task.status.replace('_', ' ')}
            <RefreshCw className="h-3 w-3" />
          </Badge>
          {task.dueDate && (
            <span className="text-xs text-muted-foreground">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
