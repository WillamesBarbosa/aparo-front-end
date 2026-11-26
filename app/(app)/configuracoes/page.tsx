'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBarbershop, useUpdateBarbershop } from '@/hooks/use-barbershop'
import { ApiError } from '@/lib/api-client'
import { BookingLinkCard } from '@/components/booking-link-card'
import type { ApiBarbershop } from '@/types/api'

const barbershopSchema = z.object({
  name: z.string().min(1, 'Informe o nome da barbearia'),
  phone: z.string().min(1, 'Informe um telefone de contato'),
})

type BarbershopFormValues = z.infer<typeof barbershopSchema>

function BarbershopForm({ barbershop }: { barbershop: ApiBarbershop }) {
  const updateBarbershop = useUpdateBarbershop()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<BarbershopFormValues>({
    resolver: zodResolver(barbershopSchema),
    defaultValues: {
      name: barbershop.name,
      phone: barbershop.phone ?? '',
    },
  })

  const onSubmit = (values: BarbershopFormValues) => {
    updateBarbershop.mutate(values, {
      // Marca os valores salvos como o novo "estado limpo" do formulário
      onSuccess: () => reset(values),
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid max-w-xl gap-4 rounded-[14px] border bg-card p-6"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nome da barbearia</Label>
        <Input id="name" aria-invalid={Boolean(errors.name)} {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="tel"
          aria-invalid={Boolean(errors.phone)}
          {...register('phone')}
        />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      {updateBarbershop.isError && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {updateBarbershop.error instanceof ApiError
            ? updateBarbershop.error.message
            : 'Não foi possível salvar as alterações.'}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        {updateBarbershop.isSuccess && !isDirty && (
          <span className="text-sm text-muted-foreground">Alterações salvas.</span>
        )}
        <Button type="submit" disabled={!isDirty || updateBarbershop.isPending}>
          {updateBarbershop.isPending ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </div>
    </form>
  )
}

export default function ConfiguracoesPage() {
  const { data: barbershop, isPending, isError, error } = useBarbershop()

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Carregando configurações...</p>
  }

  if (isError) {
    return (
      <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {error.message}
      </p>
    )
  }

return (
  <div className="grid gap-6">
    <BookingLinkCard barbershopId={barbershop.id} />
    <BarbershopForm barbershop={barbershop} />
  </div>
)}