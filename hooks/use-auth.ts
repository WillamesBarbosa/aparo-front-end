'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { authService } from '@/services/auth-service'
import { clearTokens, setTokens } from '@/lib/auth-storage'
import type { LoginRequest, RegisterRequest } from '@/types/api'

export function useLogin() {
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: (data) => {
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
      router.push('/dashboard')
    },
  })
}

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
    onSuccess: (data) => {
      setTokens(data.tokens)
      router.push('/dashboard')
    },
  })
}

export function useLogout() {
  const router = useRouter()

  return () => {
    clearTokens()
    router.push('/login')
  }
}
