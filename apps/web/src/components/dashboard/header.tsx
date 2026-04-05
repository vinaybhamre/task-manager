'use client'

import { Button } from '@/components/ui/button'
import { logout } from '@/lib/api/auth'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function Header() {
  const { user, clearAuth } = useAuthStore()
  const router = useRouter()

  async function handleLogout() {
    try {
      await logout()
      clearAuth()
      router.push('/login')
    } catch {
      toast.error('Failed to logout')
    }
  }

  return (
    <header className="border-b px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold">Task Manager</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{user?.name}</span>
        <Button variant="outline" size="lg" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  )
}
