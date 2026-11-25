'use client'

import { Button } from '@/components/ui/button'
import { useUpdateAppointmentStatus } from '@/hooks/use-appointments'
import { ApiError } from '@/lib/api-client'
import { formatAppointmentTime } from '@/lib/dates'
import { formatCurrency, formatPhone } from '@/lib/format'
import type { ApiAppointment, AppointmentStatus } from '@/types/api'

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
}

const STATUS_STYLE: Record<AppointmentStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-muted text-muted-foreground',
  CANCELLED: 'bg-destructive/10 text-destructive',
}

interface AppointmentCardProps {
  appointment: ApiAppointment
  onCancel: (appointment: ApiAppointment) => void
}

export function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
  const updateStatus = useUpdateAppointmentStatus()
  const { status, service, customer } = appointment

  const changeStatus = (next: AppointmentStatus) => {
    updateStatus.mutate({ id: appointment.id, status: next })
  }

  const isCancelled = status === 'CANCELLED'

  return (
    <li className="rounded-[14px] border bg-card p-4">
      <div className="flex items-start gap-4">
        <p
          className={`w-14 shrink-0 text-lg font-semibold ${isCancelled ? 'text-muted-foreground line-through' : ''}`}
        >
          {formatAppointmentTime(appointment.date)}
        </p>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{customer.name}</p>
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[status]}`}>
              {STATUS_LABEL[status]}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{formatPhone(customer.phone)}</p>
          <p className="mt-1 text-sm">
            {service.name} · {service.durationMins} min · {formatCurrency(service.price)}
          </p>
        </div>
      </div>

      {/* Só mostra as ações que o backend aceita para o status atual */}
      {(status === 'PENDING' || status === 'CONFIRMED') && (
        <div className="mt-3 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onCancel(appointment)}
            disabled={updateStatus.isPending}
          >
            Cancelar
          </Button>
          {status === 'PENDING' && (
            <Button size="sm" onClick={() => changeStatus('CONFIRMED')} disabled={updateStatus.isPending}>
              Confirmar
            </Button>
          )}
          {status === 'CONFIRMED' && (
            <Button size="sm" onClick={() => changeStatus('COMPLETED')} disabled={updateStatus.isPending}>
              Concluir
            </Button>
          )}
        </div>
      )}

      {updateStatus.isError && (
        <p className="mt-2 text-xs text-destructive">
          {updateStatus.error instanceof ApiError
            ? updateStatus.error.message
            : 'Não foi possível alterar o status.'}
        </p>
      )}
    </li>
  )
}