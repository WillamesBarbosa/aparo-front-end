import { apiClient } from '@/lib/api-client'
import type { ApiAppointment, AppointmentStatus } from '@/types/api'

export const appointmentsService = {
  // `date` no formato "YYYY-MM-DD"
  listByDay: (date: string) => apiClient.get<ApiAppointment[]>(`/appointments?date=${date}`),
  // `from` opcional no backend: 7 dias a partir dessa data
  listWeek: (from: string) => apiClient.get<ApiAppointment[]>(`/appointments/week?from=${from}`),
  updateStatus: (id: string, status: AppointmentStatus) =>
    apiClient.patch<ApiAppointment>(`/appointments/${id}/status`, { status }),
}