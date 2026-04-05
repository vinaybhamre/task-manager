'use client'

import { Button } from '@/components/ui/button'

import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useCreateTask, useUpdateTask } from '@/hooks/use-tasks'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Calendar } from '../ui/calendar'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(50),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
  dueDate: z.string().optional(),
})

type TaskFormValues = {
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  dueDate?: string
}

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  dueDate: string | null
}

export default function TaskForm({ task, onSuccess }: { task?: Task; onSuccess: () => void }) {
  const { mutate: createTask, isPending: isCreating } = useCreateTask()
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask()

  const [date, setDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined
  )
  const [calendarOpen, setCalendarOpen] = useState(false)

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema) as any,
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: (task?.status as TaskFormValues['status']) ?? 'TODO',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    },
  })

  function onSubmit(data: TaskFormValues) {
    const payload = {
      ...data,
      dueDate: date ? format(date, 'yyyy-MM-dd') : undefined,
    }
    if (task) {
      updateTask({ id: task.id, data: payload }, { onSuccess })
    } else {
      createTask(payload, { onSuccess })
    }
  }

  const isPending = isCreating || isUpdating

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input {...form.register('title')} placeholder="Task title" />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
          )}
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input {...form.register('description')} placeholder="Optional description" />
        </Field>
        <Field>
          <FieldLabel>Status</FieldLabel>
          <select
            {...form.register('status')}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </Field>
        <Field>
          <FieldLabel>Due Date</FieldLabel>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger className="w-full" asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d)
                  setCalendarOpen(false)
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
        </Field>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
        </Button>
      </FieldGroup>
    </form>
  )
}
