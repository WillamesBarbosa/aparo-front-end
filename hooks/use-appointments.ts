'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { appointmentsService } from '@/services/appointment-service'
import type { AppointmentStatus } from '@/types/api'

// Prefixo comum de todas as queries de agendamento. Exportado pra poder ser
// reaproveitado na invalidação.
export const appointmentsKey = ['appointments'] as const

export function useAppointmentsByDay(date: string) {
  return useQuery({
    queryKey: [...appointmentsKey, 'day', date],
    queryFn: () => appointmentsService.listByDay(date),
  })
}

export function useAppointmentsWeek(from: string) {
  return useQuery({
    queryKey: [...appointmentsKey, 'week', from],
    queryFn: () => appointmentsService.listWeek(from),
  })
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AppointmentStatus }) =>
      appointmentsService.updateStatus(id, status),
    // Invalida o prefixo ['appointments']: atualiza a agenda do dia e a da semana
    onSuccess: () => queryClient.invalidateQueries({ queryKey: appointmentsKey }),
  })
}