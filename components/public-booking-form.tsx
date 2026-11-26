'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome'),
  phone: z
    .string()
    .refine((value) => /^\d{10,11}$/.test(value.replace(/\D/g, '')), 'Informe DDD + número'),
})

export type BookingFormValues = z.infer<typeof bookingSchema>

interface PublicBookingFormProps {
  // Só habilita o botão depois que serviço, dia e horário foram escolhidos
  canSubmit: boolean
  isPending: boolean
  errorMessage?: string
  onSubmit: (values: BookingFormValues) => void
}

export function PublicBookingForm({
  canSubmit,
  isPending,
  errorMessage,
  onSubmit,
}: PublicBookingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({ resolver: zodResolver(bookingSchema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Seu nome</Label>
        <Input id="name" autoComplete="name" aria-invalid={Boolean(errors.name)} {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Telefone (WhatsApp)</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="81999999999"
          aria-invalid={Boolean(errors.phone)}
          {...register('phone')}
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      {errorMessage && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{errorMessage}</p>
      )}

      <Button type="submit" className="w-full" disabled={!canSubmit || isPending}>
        {isPending ? 'Agendando...' : 'Confirmar agendamento'}
      </Button>
      {!canSubmit && (
        <p className="text-center text-xs text-muted-foreground">
          Escolha o serviço, o dia e o horário para continuar.
        </p>
      )}
    </form>
  )
}