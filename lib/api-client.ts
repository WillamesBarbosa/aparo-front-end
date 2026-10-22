import { clearTokens, getAccessToken } from '@/lib/auth-storage'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api'

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  auth?: boolean // default true — envia Authorization: Bearer <token>
}

async function request<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const { body, auth = true, headers, ...rest } = options

  const finalHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string> | undefined),
  }

  if (auth) {
    const token = getAccessToken()
    if (token) finalHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  // 204 No Content ou respostas sem corpo
  const text = await response.text()
  const data = text ? JSON.parse(text) : undefined

  if (!response.ok) {
    // Sessão expirada/token inválido — o back ainda não tem refresh
    // rotation pronto, então por ora só limpamos e deixamos quem chamou
    // (ex: um hook) decidir redirecionar para /login.
    if (response.status === 401 && auth) {
      clearTokens()
    }
    const message = (data && (data.message || data.error)) || `Erro ${response.status} ao chamar ${path}`
    throw new ApiError(response.status, Array.isArray(message) ? message.join(', ') : message, data)
  }

  return data as TResponse
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
}
