// Tipos que espelham exatamente os contratos do backend (dossiê Aparo),
// em vez dos tipos mockados de `types/domain.ts`, que assumem um modelo
// multi-barbeiro que ainda não existe na API.

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY'

export interface ApiUser {
  id: string
  name: string
  email: string
}

export interface ApiBarbershop {
  id: string
  name: string
  phone?: string
  [key: string]: unknown
}

export interface ApiTokens {
  accessToken: string
  refreshToken: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  barbershopName: string
  barbershopPhone: string
}

export interface RegisterResponse {
  user: ApiUser
  barbershop: ApiBarbershop
  tokens: ApiTokens
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}

export interface ApiService {
  id: string
  name: string
  // Decimal do Prisma chega como string (ex: "44.9")
  price: string
  durationMins: number
  active: boolean
}

export interface ApiSchedule {
  dayOfWeek: DayOfWeek
  openTime: string
  closeTime: string
  active: boolean
}

export interface ApiAppointment {
  id: string
  barbershopId: string
  serviceId: string
  customerName: string
  customerPhone: string
  date: string
  status: AppointmentStatus
}
