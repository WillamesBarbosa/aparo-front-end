import { apiClient } from '@/lib/api-client'
import type { ApiSchedule, DayOfWeek } from '@/types/api'

export type SchedulePayload = ApiSchedule

export const schedulesService = {
  list: () => apiClient.get<ApiSchedule[]>('/schedules'),
  // O backend faz upsert por dia: cria se o dia não existe, atualiza se já existe
  save: (payload: SchedulePayload) => apiClient.post<ApiSchedule>('/schedules', payload),
  remove: (dayOfWeek: DayOfWeek) => apiClient.delete<void>(`/schedules/${dayOfWeek}`),
}