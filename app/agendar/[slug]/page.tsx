'use client'

import { useState } from 'react'

import { AppointmentCard } from '@/components/appointment-card'
import { CancelAppointmentDialog } from '@/components/cancel-appointments-card'
import { Button } from '@/components/ui/button'
import { useAppointmentsByDay, useAppointmentsWeek } from '@/hooks/use-appointments'
import { formatDayLong, nextDayKeys, todayKey } from '@/lib/dates'
import type { ApiAppointment } from '@/types/api'

type View = 'today' | 'week'

interface ListProps {
  onCancel: (appointment: ApiAppointment) => void
}

function TodayList({ onCancel }: ListProps) {
  const { data: appointments, isPending, isError, error } = useAppointmentsByDay(todayKey())

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando agenda...</p>
  if (isError) {
    return (
      <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {error.message}
      </p>
    )
  }
  if (appointments.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum agendamento para hoje.</p>
  }

  return (
    <ul className="grid gap-3">
      {appointments.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} onCancel={onCancel} />
      ))}
    </ul>
  )
}

function WeekList({ onCancel }: ListProps) {
  const days = nextDayKeys(7)
  const { data: appointments, isPending, isError, error } = useAppointmentsWeek(days[0])

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando agenda...</p>
  if (isError) {
    return (
      <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {error.message}
      </p>
    )
  }

  // Agrupa por dia. O horário do ISO já é o horário da barbearia, então o dia
  // são os 10 primeiros caracteres ("2026-10-27").
  const byDay = new Map<string, ApiAppointment[]>()
  for (const appointment of appointments) {
    const key = appointment.date.slice(0, 10)
    byDay.set(key, [...(byDay.get(key) ?? []), appointment])
  }

  return (
    <div className="grid gap-6">
      {days.map((dayKey) => {
        const dayAppointments = byDay.get(dayKey) ?? []
        return (
          <section key={dayKey} className="grid gap-3">
            <h2 className="text-sm font-semibold capitalize text-muted-foreground">
              {formatDayLong(dayKey)}
            </h2>
            {dayAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem agendamentos.</p>
            ) : (
              <ul className="grid gap-3">
                {dayAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onCancel={onCancel}
                  />
                ))}
              </ul>
            )}
          </section>
        )
      })}
    </div>
  )
}

export default function AgendaPage() {
  const [view, setView] = useState<View>('today')

  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelling, setCancelling] = useState<ApiAppointment | null>(null)

  const openCancel = (appointment: ApiAppointment) => {
    setCancelling(appointment)
    setCancelOpen(true)
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button variant={view === 'today' ? 'default' : 'outline'} onClick={() => setView('today')}>
            Hoje
          </Button>
          <Button variant={view === 'week' ? 'default' : 'outline'} onClick={() => setView('week')}>
            Próximos 7 dias
          </Button>
        </div>
        {view === 'today' && (
          <p className="hidden text-sm capitalize text-muted-foreground sm:block">
            {formatDayLong(todayKey())}
          </p>
        )}
      </div>

      {view === 'today' ? <TodayList onCancel={openCancel} /> : <WeekList onCancel={openCancel} />}

      <CancelAppointmentDialog
        appointment={cancelling}
        open={cancelOpen}
        onOpenChange={setCancelOpen}
      />
    </div>
  )
}