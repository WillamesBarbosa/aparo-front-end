'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarDays, LogOut, CircleHelp, Clock3, FileBarChart, LayoutDashboard, Menu, MoreHorizontal, Scissors, Settings, Users, UserRound, X, CalendarClock } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/use-auth'
import { useBarbershop } from '@/hooks/use-barbershop'

const navItems = [
  { href: '/dashboard', label: 'Visão geral', icon: LayoutDashboard },
  { href: '/agenda', label: 'Agenda', icon: CalendarDays },
  { href: '/agendamentos', label: 'Agendamentos', icon: Clock3 },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/servicos', label: 'Serviços', icon: Scissors },
  { href: '/horarios', label: 'Horários', icon: CalendarClock },
  { href: '/profissionais', label: 'Profissionais', icon: UserRound },
  { href: '/relatorios', label: 'Relatórios', icon: FileBarChart },
]

const extraTitles: Record<string, string> = { '/horarios': 'Horários', '/configuracoes': 'Configurações' }

// Título do cabeçalho a partir da rota atual
function usePageTitle() {
  const pathname = usePathname()
  return navItems.find((item) => item.href === pathname)?.label ?? extraTitles[pathname] ?? ''
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

// Nome da barbearia logada (vem de GET /barbershops/me)
function useBarbershopName() {
  const { data } = useBarbershop()
  return data?.name ?? 'Minha barbearia'
}

function SidebarUser() {
  const name = useBarbershopName()
  const logout = useLogout()
  return (
    <div className="mt-3 flex items-center gap-3 rounded-lg px-3 py-3">
      <span className="flex size-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
        {getInitials(name)}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">{name}</span>
      <button
        type="button"
        onClick={logout}
        aria-label="Sair da conta"
        className="rounded-lg p-2 text-sidebar-foreground/65 hover:bg-white/10 hover:text-white"
      >
        <LogOut className="size-[18px]" />
      </button>
    </div>
  )
}

function Logo() { return <Link href="/dashboard" className="flex items-center gap-3 text-white"><span className="flex size-9 items-center justify-center rounded-xl bg-primary font-black text-lg text-primary-foreground">A</span><span className="text-xl font-semibold tracking-tight">aparo</span></Link> }

export function AppSidebar() {
  const pathname = usePathname()

  return (
<aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto bg-sidebar px-4 py-5 text-sidebar-foreground lg:flex">      <Logo />
      <div className="mt-10 flex flex-1 flex-col gap-1">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/45">
          Menu principal
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground/65 hover:bg-white/10 hover:text-white',
              )}
            >
              <Icon className="size-[18px]" />
              {label}
            </Link>
          )
        })}
      </div>
      <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
        <Link
          href="/configuracoes"
          className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-sidebar-foreground/65 hover:bg-white/10 hover:text-white"
        >
          <Settings className="size-[18px]" />
          Configurações
        </Link>
        <SidebarUser />
      </div>
    </aside>
  )
}

export function MobileBottomNav() { const pathname = usePathname(); const items = navItems.slice(0, 4); return <nav className="fixed inset-x-0 bottom-0 z-20 flex h-16 items-center justify-around border-t bg-background/95 px-2 backdrop-blur lg:hidden">{items.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={cn('flex min-w-16 flex-col items-center justify-center gap-1 text-[10px] font-medium', pathname === href ? 'text-primary' : 'text-muted-foreground')}><Icon className="size-5" />{label}</Link>)}<Link href="/configuracoes" className="flex min-w-16 flex-col items-center justify-center gap-1 text-[10px] font-medium text-muted-foreground"><MoreHorizontal className="size-5" />Mais</Link></nav> }

export function AppHeader({ title, description }: { title?: string; description?: string }) {
  const [open, setOpen] = useState(false)
  const pathTitle = usePageTitle()
  const heading = title ?? pathTitle
  const name = useBarbershopName()
  const logout = useLogout()

  return (
    <header className="flex min-h-20 items-center justify-between border-b bg-background px-5 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 hover:bg-muted lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu />
        </button>
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{heading}</h1>
          {description && <p className="hidden text-sm text-muted-foreground sm:block">{description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm font-medium md:block">{name}</span>
        <span className="flex size-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
          {getInitials(name)}
        </span>
      </div>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)}>
          <div
            className="h-full w-72 bg-sidebar p-5 text-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Fechar menu">
                <X />
              </button>
            </div>

            <div className="mt-10 flex flex-col gap-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  onClick={() => setOpen(false)}
                  key={href}
                  href={href}
                  className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-white/70 hover:bg-white/10"
                >
                  <Icon className="size-[18px]" />
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-1 border-t border-white/10 pt-4">
              <Link
                href="/configuracoes"
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-white/70 hover:bg-white/10"
              >
                <Settings className="size-[18px]" />
                Configurações
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm text-white/70 hover:bg-white/10"
              >
                <LogOut className="size-[18px]" />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) { return <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-2xl font-semibold tracking-tight">{title}</h2>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}</div>{action}</div> }

export function StatusBadge({ status }: { status: 'confirmed' | 'pending' | 'cancelled' }) { const labels = { confirmed: 'Confirmado', pending: 'Pendente', cancelled: 'Cancelado' }; return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium', status === 'confirmed' && 'bg-green-100 text-green-800', status === 'pending' && 'bg-orange-100 text-orange-800', status === 'cancelled' && 'bg-red-100 text-red-800')}>{labels[status]}</span> }
export function EmptyState({ title = 'Nada por aqui ainda', description = 'Quando houver novos registros, eles aparecerão nesta área.' }: { title?: string; description?: string }) { return <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-card p-6 text-center"><CircleHelp className="mb-3 size-8 text-muted-foreground/50" /><p className="font-medium">{title}</p><p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p></div> }
export function LoadingSkeleton() { return <div className="h-24 animate-pulse rounded-xl bg-muted" aria-label="Carregando" /> }
