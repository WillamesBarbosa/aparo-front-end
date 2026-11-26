'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowUpRight, CalendarDays, CircleCheck, CircleDollarSign, Clock3 } from 'lucide-react'

import { AppointmentCard } from '@/components/appointment-card'
import { CancelAppointmentDialog } from '@/components/cancel-appointments-dialog'
import { EmptyState, LoadingSkeleton, PageHeader } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { useAppointmentsByDay } from '@/hooks/use-appointments'
import { useBarbershop } from '@/hooks/use-barbershop'
import { formatDayLong, todayKey } from '@/lib/dates'
import { formatCurrency } from '@/lib/format'
import type { ApiAppointment } from '@/types/api'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function DashboardPage() {
  const today = todayKey()
  const { data: appointments, isPending, isError, error } = useAppointmentsByDay(today)
  const { data: barbershop } = useBarbershop()

  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelling, setCancelling] = useState<ApiAppointment | null>(null)

  const openCancel = (appointment: ApiAppointment) => {
    setCancelling(appointment)
    setCancelOpen(true)
  }

  // Os números do dia saem da própria lista de hoje, sem chamada extra.
  // Cancelados não contam como agendamento nem como receita.
  const list = appointments ?? []
  const active = list.filter((appointment) => appointment.status !== 'CANCELLED')
  const pending = active.filter((appointment) => appointment.status === 'PENDING').length
  const confirmed = active.filter((appointment) => appointment.status === 'CONFIRMED').length
  const revenue = active.reduce((total, appointment) => total + Number(appointment.service.price), 0)

  const stats = [
    { label: 'Agendamentos hoje', value: String(active.length), icon: CalendarDays },
    { label: 'Aguardando confirmação', value: String(pending), icon: Clock3 },
    { label: 'Confirmados', value: String(confirmed), icon: CircleCheck },
    { label: 'Receita prevista', value: formatCurrency(revenue), icon: CircleDollarSign },
  ]

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8">
      <PageHeader
        title={greeting()}
        description={
          barbershop ? `Aqui está o resumo de hoje na ${barbershop.name}.` : 'Aqui está o resumo de hoje.'
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon />
              </span>
            </div>
            <strong className="mt-5 block text-2xl font-semibold tracking-tight">
              {isPending ? '—' : value}
            </strong>
          </div>
        ))}
      </section>

      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Agenda de hoje</h3>
            <p className="mt-1 text-sm capitalize text-muted-foreground">{formatDayLong(today)}</p>
          </div>
          <Button render={<Link href="/agenda" />} nativeButton={false} variant="ghost" size="sm">
            Ver agenda <ArrowUpRight data-icon="inline-end" />
          </Button>
        </div>

        {isPending && <LoadingSkeleton />}

        {isError && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error.message}
          </p>
        )}

        {appointments && appointments.length === 0 && (
          <EmptyState
            title="Nenhum agendamento hoje"
            description="Quando um cliente agendar, ele aparece aqui."
          />
        )}

        {list.length > 0 && (
          <ul className="grid gap-3">
            {list.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} onCancel={openCancel} />
            ))}
          </ul>
        )}
      </section>

      <CancelAppointmentDialog
        appointment={cancelling}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
      />
    </div>
  )
}