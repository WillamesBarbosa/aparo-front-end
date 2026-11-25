import { apiClient } from '@/lib/api-client'
import type { ApiBarbershop } from '@/types/api'

export interface BarbershopPayload {
  name: string
  phone: string
}

export const barbershopService = {
  getMine: () => apiClient.get<ApiBarbershop>('/barbershops/me'),
  updateMine: (payload: Partial<BarbershopPayload>) =>
    apiClient.put<ApiBarbershop>('/barbershops/me', payload),
}