import { apiClient } from '@/lib/api-client'
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '@/types/api'

export const authService = {
  register: (payload: RegisterRequest) =>
    apiClient.post<RegisterResponse>('/auth/register', payload, { auth: false }),
  login: (payload: LoginRequest) =>
    apiClient.post<LoginResponse>('/auth/login', payload, { auth: false }),
}
