import { apiClient } from '@/lib/api-client'
import type {
  ApiAppointment,
  ApiAvailability,
  ApiPublicBarbershop,
  PublicAppointmentRequest,
} from '@/types/api'

// Todas as chamadas daqui são públicas: `auth: false` não envia o token.
// Isso também evita que um 401 limpe a sessão de um barbeiro que esteja
// logado no mesmo navegador testando a própria página.
export const publicService = {
  // O :id da rota é o id da barbearia
  getBarbershop: (barbershopId: string) =>
    apiClient.get<ApiPublicBarbershop>(`/services/${barbershopId}`, { auth: false }),

  // 7 dias a partir de hoje (no horário da barbearia), com os slots livres de cada um
  getWeekAvailability: (barbershopId: string, serviceId: string) => {
    const query = new URLSearchParams({ barbershopId, serviceId })
    return apiClient.get<ApiAvailability[]>(`/appointments/available/week?${query}`, { auth: false })
  },

  createAppointment: (payload: PublicAppointmentRequest) =>
    apiClient.post<ApiAppointment>('/appointments/public', payload, { auth: false }),
}