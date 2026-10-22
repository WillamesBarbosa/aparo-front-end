// Armazenamento de tokens no client (localStorage).
//
// Isto é um stopgap para o MVP: o dossiê indica que a rotação de refresh
// token via Redis ainda está pendente no backend. Quando isso existir,
// o ideal é migrar para refresh token em cookie httpOnly setado pelo
// próprio backend (ou por uma Route Handler do Next fazendo proxy),
// evitando guardar tokens sensíveis em localStorage.

const ACCESS_TOKEN_KEY = 'aparo.accessToken'
const REFRESH_TOKEN_KEY = 'aparo.refreshToken'

function isBrowser() {
  return typeof window !== 'undefined'
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null
  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null
  return window.localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(tokens: { accessToken: string; refreshToken: string }) {
  if (!isBrowser()) return
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
}

export function clearTokens() {
  if (!isBrowser()) return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken())
}
