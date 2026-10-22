'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { AppHeader, AppSidebar, MobileBottomNav } from '@/components/shared'
import { isAuthenticated } from '@/lib/auth-storage'

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter()
  // null = ainda verificando (evita flash de conteúdo protegido no primeiro render)
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
      return
    }
    setAuthorized(true)
  }, [router])

  if (!authorized) return null

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader title="Visão geral" description="Acompanhe o que acontece na sua barbearia." />
        <main className="flex-1 overflow-auto bg-muted/30 px-5 py-7 pb-24 sm:px-8 lg:pb-8">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  )
}
