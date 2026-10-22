export type UserRole = 'owner' | 'admin' | 'barber'
export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled'

export interface Barbershop { id: string; name: string; slug: string; city: string }
export interface User { id: string; barbershopId: string; name: string; email: string; role: UserRole; avatar?: string }
export interface Barber { id: string; barbershopId: string; name: string; specialty: string; active: boolean }
export interface Service { id: string; barbershopId: string; name: string; durationMinutes: number; price: number; active: boolean }
export interface Client { id: string; barbershopId: string; name: string; phone: string; lastVisit?: string; visits: number }
export interface Appointment { id: string; barbershopId: string; clientId: string; barberId: string; serviceId: string; startsAt: string; status: AppointmentStatus }
export interface Schedule { id: string; barbershopId: string; barberId: string; weekday: number; opensAt: string; closesAt: string; enabled: boolean }
export interface Slot { id: string; barbershopId: string; barberId: string; startsAt: string; available: boolean }
