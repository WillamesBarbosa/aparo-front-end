'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { schedulesService, type SchedulePayload } from '@/services/schedules-service'
import type { DayOfWeek } from '@/types/api'

export const schedulesKey = ['schedules'] as const

export function useSchedules() {
  return useQuery({ queryKey: schedulesKey, queryFn: schedulesService.list })
}

export function useSaveSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SchedulePayload) => schedulesService.save(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: schedulesKey }),
  })
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dayOfWeek: DayOfWeek) => schedulesService.remove(dayOfWeek),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: schedulesKey }),
  })
}