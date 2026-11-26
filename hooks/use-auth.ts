'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { authService } from '@/services/auth-service'
import { clearTokens, setTokens } from '@/lib/auth-storage'
import type { LoginRequest, RegisterRequest } from '@/types/api'

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: (data) => {
      // Limpa o cache: nada da sessão anterior pode aparecer para este usuário
      queryClient.clear()
      setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
      router.push('/dashboard')
    },
  })
}

export function useRegister() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
    onSuccess: (data) => {
      queryClient.clear()
      setTokens(data.tokens)
      router.push('/dashboard')
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return () => {
    clearTokens()
    // Sem isso, quem entrar em seguida neste navegador veria dados em cache da conta anterior
    queryClient.clear()
    router.push('/login')
  }
}