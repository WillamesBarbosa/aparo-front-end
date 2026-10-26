import { apiClient } from '@/lib/api-client'
import type { ApiService } from '@/types/api'

export interface ServicePayload {
    name: string
    price: number
    durationMins: number
    active: boolean
}

export const servicesService = {
    list: ()=> apiClient.get<ApiService[]>('/services'),
    create: (payload: ServicePayload) => apiClient.post<ApiService>('/services', payload),
    update: (id: string, payload: Partial<ServicePayload>)=> apiClient.put<ApiService>(`/services/${id}`, payload),
    remove: (id: string) => apiClient.delete<void>(`/services/${id}`)
}