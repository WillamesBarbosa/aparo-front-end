'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateServices, useUpdateServices } from '@/hooks/use-services'
import { ApiError } from '@/lib/api-client'
import type { ApiService } from '@/types/api'

const serviceSchema = z.object({
  name: z.string().min(1, 'Informe o nome do serviço'),
  price: z.number({ error: 'Informe o preço' }).positive('O preço deve ser maior que zero'),
  durationMins: z
    .number({ error: 'Informe a duração' })
    .int('Use minutos inteiros')
    .positive('A duração deve ser maior que zero'),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

interface ServiceFormProps {
  // Sem `service` = modo criar. Com `service` = modo editar.
  service?: ApiService
  onDone: () => void
}

export function ServiceForm({ service, onDone }: ServiceFormProps) {
  const createService = useCreateServices()
  const updateService = useUpdateServices()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service
      ? {
          name: service.name,
          price: Number(service.price),
          durationMins: service.durationMins,
        }
      : undefined,
  })

  const isPending = createService.isPending || updateService.isPending
  const error = createService.error ?? updateService.error

  const onSubmit = (values: ServiceFormValues) => {
    if (service) {
      updateService.mutate(
        { id: service.id, payload: { ...values, active: service.active } },
        { onSuccess: onDone },
      )
    } else {
      createService.mutate({ ...values, active: true }, { onSuccess: onDone })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="name">Nome do serviço</Label>
        <Input id="name" aria-invalid={Boolean(errors.name)} {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="price">Preço (R$)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          inputMode="decimal"
          aria-invalid={Boolean(errors.price)}
          {...register('price', { valueAsNumber: true })}
        />
        {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="durationMins">Duração (min)</Label>
        <Input
          id="durationMins"
          type="number"
          inputMode="numeric"
          aria-invalid={Boolean(errors.durationMins)}
          {...register('durationMins', { valueAsNumber: true })}
        />
        {errors.durationMins && (
          <p className="text-xs text-destructive">{errors.durationMins.message}</p>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive sm:col-span-2">
          {error instanceof ApiError ? error.message : 'Não foi possível salvar o serviço.'}
        </p>
      )}

      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando...' : service ? 'Salvar alterações' : 'Adicionar serviço'}
        </Button>
      </div>
    </form>
  )
}