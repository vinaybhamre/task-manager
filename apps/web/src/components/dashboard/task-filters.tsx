'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback } from 'react'

const STATUSES = ['ALL', 'TODO', 'IN_PROGRESS', 'DONE']

function TaskFiltersContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const status = searchParams.get('status') ?? 'ALL'
  const search = searchParams.get('search') ?? ''

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== 'ALL') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page')
      router.push(`?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        placeholder="Search tasks..."
        defaultValue={search}
        onChange={(e) => updateParams('search', e.target.value)}
        className="max-w-sm py-4"
      />
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <Button
            key={s}
            variant={status === s ? 'default' : 'outline'}
            size="lg"
            onClick={() => updateParams('status', s)}
          >
            {s.replace('_', ' ')}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default function TaskFilters() {
  return (
    <Suspense fallback={null}>
      <TaskFiltersContent />
    </Suspense>
  )
}
