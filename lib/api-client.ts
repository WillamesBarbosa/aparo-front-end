import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@/lib/auth-storage'

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

// ---- Renovação da sessão (refresh token) ----

// Pede um novo par de tokens ao backend. Usa fetch direto (e não `request`) de
// propósito: se o próprio refresh passasse pelo `request`, um 401 nele geraria
// outro refresh, e assim por diante.
async function callRefreshEndpoint(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    if (!response.ok) return false

    const data = await response.json()
    // Com rotação, o backend devolve um refresh token novo e o antigo deixa de valer
    setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken ?? refreshToken })
    return true
  } catch {
    return false
  }
}

// Guarda a renovação em andamento. Se várias requisições tomarem 401 ao mesmo
// tempo (o dashboard dispara duas de uma vez), todas esperam a MESMA renovação.
// Com rotação, mandar o mesmo refresh token duas vezes faria a segunda falhar.
let refreshInFlight: Promise<boolean> | null = null

function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = callRefreshEndpoint().finally(() => {
      refreshInFlight = null
    })
  }
  return refreshInFlight
}

// Sessão perdida de vez (refresh inválido ou expirado): limpa e volta para o login.
// O redirecionamento com recarga de página também zera o cache do TanStack Query.
function expireSession() {
  clearTokens()
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.assign('/login')
  }
}

// ---- Requisições ----

async function request<TResponse>(
  path: string,
  options: RequestOptions = {},
  hasRetried = false,
): Promise<TResponse> {
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
    if (response.status === 401 && auth) {
      // Access token vencido: renova uma vez e repete a mesma requisição
      if (!hasRetried && (await refreshSession())) {
        return request<TResponse>(path, options, true)
      }
      expireSession()
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
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
}