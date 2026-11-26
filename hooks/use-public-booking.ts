'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { ApiError } from '@/lib/api-client'
import { publicService } from '@/services/public-service'
import type { PublicAppointmentRequest } from '@/types/api'

export const publicKey = ['public'] as const

export function usePublicBarbershop(barbershopId: string) {
  return useQuery({
    queryKey: [...publicKey, 'barbershop', barbershopId],
    queryFn: () => publicService.getBarbershop(barbershopId),
    // Barbearia inexistente (404) deve aparecer na hora, sem tentar de novo
    retry: false,
  })
}

export function usePublicWeek(barbershopId: string, serviceId: string | null) {
  return useQuery({
    queryKey: [...publicKey, 'week', barbershopId, serviceId],
    // `enabled` garante que serviceId existe quando a função roda
    queryFn: () => publicService.getWeekAvailability(barbershopId, serviceId as string),
    enabled: Boolean(serviceId),
  })
}

export function useCreatePublicAppointment() {
  const queryClient = useQueryClient()
  const refreshAvailability = () => queryClient.invalidateQueries({ queryKey: publicKey })

  return useMutation({
    mutationFn: (payload: PublicAppointmentRequest) => publicService.createAppointment(payload),
    // Agendou: aquele horário deixou de estar livre
    onSuccess: refreshAvailability,
    // 409: alguém pegou o horário antes. Recarrega os slots para a tela refletir isso
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) refreshAvailability()
    },
  })
}