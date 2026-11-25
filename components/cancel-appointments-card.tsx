'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUpdateAppointmentStatus } from '@/hooks/use-appointments'
import { ApiError } from '@/lib/api-client'
import { formatAppointmentTime } from '@/lib/dates'
import type { ApiAppointment } from '@/types/api'

interface CancelAppointmentDialogProps {
  appointment: ApiAppointment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CancelAppointmentDialog({
  appointment,
  open,
  onOpenChange,
}: CancelAppointmentDialogProps) {
  const updateStatus = useUpdateAppointmentStatus()

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) updateStatus.reset()
    onOpenChange(nextOpen)
  }

  const handleConfirm = () => {
    if (!appointment) return
    updateStatus.mutate(
      { id: appointment.id, status: 'CANCELLED' },
      { onSuccess: () => handleOpenChange(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cancelar agendamento?</DialogTitle>
          <DialogDescription>
            {appointment
              ? `O horário das ${formatAppointmentTime(appointment.date)} de ${appointment.customer.name} ficará livre. Essa ação não pode ser desfeita.`
              : ''}
          </DialogDescription>
        </DialogHeader>

        {updateStatus.isError && (
          <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {updateStatus.error instanceof ApiError
              ? updateStatus.error.message
              : 'Não foi possível cancelar o agendamento.'}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={updateStatus.isPending}
          >
            Manter agendamento
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={updateStatus.isPending}>
            {updateStatus.isPending ? 'Cancelando...' : 'Cancelar agendamento'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}