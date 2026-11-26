'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { CircleCheck } from 'lucide-react'

import { PublicBookingForm, type BookingFormValues } from '@/components/public-booking-form'
import { Button } from '@/components/ui/button'
import {
  useCreatePublicAppointment,
  usePublicBarbershop,
  usePublicWeek,
} from '@/hooks/use-public-booking'
import { ApiError } from '@/lib/api-client'
import { buildAppointmentDate, formatDayLong, formatDayShort } from '@/lib/dates'
import { formatCurrency } from '@/lib/format'
import type { ApiAvailability } from '@/types/api'

const UNAVAILABLE_LABEL: Record<string, string> = {
  no_schedule: 'Fechado',
  fully_booked: 'Lotado',
  past_date: 'Passou',
}

// O dia vem como meia-noite em ISO ("2026-10-27T00:00:00.000Z"): os 10 primeiros caracteres
const dayKeyOf = (day: ApiAvailability) => day.date.slice(0, 10)

export default function PublicBookingPage() {
  const { barbershopId } = useParams<{ barbershopId: string }>()

  // O que o cliente já escolheu
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [dayKey, setDayKey] = useState<string | null>(null)
  const [slot, setSlot] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const barbershop = usePublicBarbershop(barbershopId)
  const week = usePublicWeek(barbershopId, serviceId)
  const createAppointment = useCreatePublicAppointment()

  if (barbershop.isPending) {
    return <main className="p-6 text-sm text-muted-foreground">Carregando...</main>
  }

  if (barbershop.isError) {
    const notFound = barbershop.error instanceof ApiError && barbershop.error.status === 404
    return (
      <main className="mx-auto max-w-xl p-6">
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {notFound ? 'Barbearia não encontrada. Confira o link.' : barbershop.error.message}
        </p>
      </main>
    )
  }

  const { barbershop: shop, services } = barbershop.data
  const selectedService = services.find((service) => service.id === serviceId)
  const days = week.data ?? []
  const selectedDay = days.find((day) => dayKeyOf(day) === dayKey)

  const chooseService = (id: string) => {
    setServiceId(id)
    setDayKey(null)
    setSlot(null)
    createAppointment.reset()
  }

  const chooseDay = (key: string) => {
    setDayKey(key)
    setSlot(null)
    createAppointment.reset()
  }

  const handleSubmit = (values: BookingFormValues) => {
    if (!serviceId || !dayKey || !slot) return
    createAppointment.mutate(
      {
        barbershopId,
        serviceId,
        customerName: values.name.trim(),
        customerPhone: values.phone.replace(/\D/g, ''),
        date: buildAppointmentDate(dayKey, slot),
      },
      {
        onSuccess: () => setDone(true),
        // Horário ocupado ou inválido: pede para escolher de novo
        onError: () => setSlot(null),
      },
    )
  }

  const resetAll = () => {
    setServiceId(null)
    setDayKey(null)
    setSlot(null)
    setDone(false)
    createAppointment.reset()
  }

  // Mensagem amigável para o conflito de horário; nos outros casos, a do backend
  const error = createAppointment.error
  const errorMessage = !error
    ? undefined
    : error instanceof ApiError && error.status === 409
      ? 'Esse horário acabou de ser ocupado. Escolha outro horário.'
      : error.message

  if (done && selectedService && dayKey && slot) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <div className="grid gap-4 rounded-[14px] border bg-card p-6 text-center">
          <CircleCheck className="mx-auto size-12 text-green-700" />
          <h1 className="text-xl font-semibold">Agendamento solicitado!</h1>
          <p className="text-sm text-muted-foreground">
            {selectedService.name} na {shop.name}
            <br />
            <span className="capitalize">{formatDayLong(dayKey)}</span> às {slot}
          </p>
          <p className="text-sm text-muted-foreground">
            A barbearia vai confirmar o seu horário em breve.
          </p>
          <Button variant="outline" onClick={resetAll}>
            Fazer outro agendamento
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto grid max-w-xl gap-8 p-6">
      <header>
        <h1 className="text-2xl font-semibold">{shop.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Agende o seu horário.</p>
      </header>

      {/* 1. Serviço */}
      <section className="grid gap-3">
        <h2 className="font-semibold">1. Escolha o serviço</h2>
        {services.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Esta barbearia ainda não tem serviços disponíveis.
          </p>
        )}
        <ul className="grid gap-2">
          {services.map((service) => (
            <li key={service.id}>
              <button
                type="button"
                aria-pressed={service.id === serviceId}
                onClick={() => chooseService(service.id)}
                className={`flex min-h-11 w-full items-center justify-between rounded-[14px] border p-4 text-left transition-colors ${
                  service.id === serviceId ? 'border-primary bg-primary/5' : 'bg-card hover:bg-muted/50'
                }`}
              >
                <span>
                  <span className="block font-medium">{service.name}</span>
                  <span className="text-sm text-muted-foreground">{service.durationMins} min</span>
                </span>
                <span className="font-semibold">{formatCurrency(service.price)}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Dia e horário */}
      {serviceId && (
        <section className="grid gap-3">
          <h2 className="font-semibold">2. Escolha o dia e o horário</h2>

          {week.isPending && <p className="text-sm text-muted-foreground">Buscando horários...</p>}
          {week.isError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {week.error.message}
            </p>
          )}

          {week.data && (
            <>
              <ul className="flex gap-2 overflow-x-auto pb-1">
                {days.map((day) => {
                  const key = dayKeyOf(day)
                  const { weekday, day: dayNumber } = formatDayShort(key)
                  return (
                    <li key={key} className="shrink-0">
                      <button
                        type="button"
                        disabled={!day.available}
                        aria-pressed={key === dayKey}
                        onClick={() => chooseDay(key)}
                        className={`flex min-h-11 w-16 flex-col items-center rounded-[10px] border px-2 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                          key === dayKey ? 'border-primary bg-primary text-primary-foreground' : 'bg-card'
                        }`}
                      >
                        <span className="text-xs capitalize">{weekday}</span>
                        <span className="text-base font-semibold">{dayNumber}</span>
                        {!day.available && (
                          <span className="text-[10px]">
                            {UNAVAILABLE_LABEL[day.reason ?? ''] ?? 'Indisponível'}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>

              {selectedDay && (
                <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {selectedDay.slots.map((time) => (
                    <li key={time}>
                      <Button
                        type="button"
                        variant={time === slot ? 'default' : 'outline'}
                        aria-pressed={time === slot}
                        className="w-full"
                        onClick={() => setSlot(time)}
                      >
                        {time}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      )}

      {/* 3. Dados do cliente */}
      {serviceId && (
        <section className="grid gap-3">
          <h2 className="font-semibold">3. Seus dados</h2>
          <PublicBookingForm
            canSubmit={Boolean(serviceId && dayKey && slot)}
            isPending={createAppointment.isPending}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
          />
        </section>
      )}
    </main>
  )
}