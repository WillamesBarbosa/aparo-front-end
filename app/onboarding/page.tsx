'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegister } from '@/hooks/use-auth'
import { ApiError } from '@/lib/api-client'

const registerSchema = z.object({
  name: z.string().min(1, 'Informe seu nome'),
  email: z.string().min(1, 'Informe o e-mail').email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo de 6 caracteres'),
  barbershopName: z.string().min(1, 'Informe o nome da barbearia'),
  barbershopPhone: z.string().min(1, 'Informe um telefone de contato'),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function OnboardingPage() {
  const registerBarbershop = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = (values: RegisterFormValues) => {
    registerBarbershop.mutate(values)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-lg rounded-xl border bg-card p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary font-black text-lg text-primary-foreground">
            A
          </span>
          <span className="text-xl font-semibold">aparo</span>
        </div>

        <h1 className="text-2xl font-semibold">Vamos configurar sua barbearia</h1>
        <p className="mt-2 text-muted-foreground">Em poucos passos, seu espaço estará pronto para receber agendamentos.</p>

        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="name">Seu nome</Label>
            <Input id="name" autoComplete="name" aria-invalid={Boolean(errors.name)} {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} {...register('email')} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              {...register('password')}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="barbershopName">Nome da barbearia</Label>
            <Input
              id="barbershopName"
              aria-invalid={Boolean(errors.barbershopName)}
              {...register('barbershopName')}
            />
            {errors.barbershopName && (
              <p className="text-xs text-destructive">{errors.barbershopName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="barbershopPhone">Telefone da barbearia</Label>
            <Input
              id="barbershopPhone"
              type="tel"
              placeholder="81999999999"
              aria-invalid={Boolean(errors.barbershopPhone)}
              {...register('barbershopPhone')}
            />
            {errors.barbershopPhone && (
              <p className="text-xs text-destructive">{errors.barbershopPhone.message}</p>
            )}
          </div>

          {registerBarbershop.isError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive sm:col-span-2">
              {registerBarbershop.error instanceof ApiError
                ? registerBarbershop.error.message
                : 'Não foi possível criar sua conta. Tente novamente.'}
            </p>
          )}

          <Button type="submit" className="mt-2 sm:col-span-2" disabled={registerBarbershop.isPending}>
            {registerBarbershop.isPending ? 'Criando...' : 'Começar configuração'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem conta?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
