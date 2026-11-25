'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { barbershopService, type BarbershopPayload } from '@/services/barbershop-service'

export const barbershopKey = ['barbershop'] as const

export function useBarbershop() {
  return useQuery({ queryKey: barbershopKey, queryFn: barbershopService.getMine })
}

export function useUpdateBarbershop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<BarbershopPayload>) => barbershopService.updateMine(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: barbershopKey }),
  })
}