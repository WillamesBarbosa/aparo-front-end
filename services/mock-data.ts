import type { Appointment, Barber, Barbershop, Client, Service } from '@/types/domain'

export const demoBarbershop: Barbershop = { id: 'shop-1', name: 'Aparo Jardins', slug: 'aparo-jardins', city: 'São Paulo, SP' }
export const demoBarbers: Barber[] = [
  { id: 'barber-1', barbershopId: 'shop-1', name: 'Rafael Lima', specialty: 'Cortes clássicos', active: true },
  { id: 'barber-2', barbershopId: 'shop-1', name: 'Caio Mendes', specialty: 'Barba e acabamento', active: true },
]
export const demoServices: Service[] = [
  { id: 'service-1', barbershopId: 'shop-1', name: 'Corte masculino', durationMinutes: 45, price: 55, active: true },
  { id: 'service-2', barbershopId: 'shop-1', name: 'Barba completa', durationMinutes: 30, price: 40, active: true },
]
export const demoClients: Client[] = [
  { id: 'client-1', barbershopId: 'shop-1', name: 'Marcos Oliveira', phone: '(11) 99999-1200', lastVisit: 'Hoje', visits: 12 },
  { id: 'client-2', barbershopId: 'shop-1', name: 'Pedro Santos', phone: '(11) 98888-4500', lastVisit: 'Ontem', visits: 8 },
  { id: 'client-3', barbershopId: 'shop-1', name: 'Lucas Almeida', phone: '(11) 97777-8300', lastVisit: '12 jun', visits: 5 },
]
export const demoAppointments: Appointment[] = [
  { id: 'apt-1', barbershopId: 'shop-1', clientId: 'client-1', barberId: 'barber-1', serviceId: 'service-1', startsAt: '09:00', status: 'confirmed' },
  { id: 'apt-2', barbershopId: 'shop-1', clientId: 'client-2', barberId: 'barber-2', serviceId: 'service-2', startsAt: '10:30', status: 'confirmed' },
  { id: 'apt-3', barbershopId: 'shop-1', clientId: 'client-3', barberId: 'barber-1', serviceId: 'service-1', startsAt: '14:00', status: 'pending' },
]
