'use client'

import { useState, useSyncExternalStore } from 'react'
import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Lê o endereço do site (ex: http://localhost:3000 ou o domínio da Vercel).
// No servidor devolve '' e no navegador devolve o endereço real, sem causar
// diferença entre o HTML do servidor e o do cliente (hydration mismatch).
const subscribe = () => () => {}
const getOrigin = () => window.location.origin
const getServerOrigin = () => ''

export function BookingLinkCard({ barbershopId }: { barbershopId: string }) {
  const origin = useSyncExternalStore(subscribe, getOrigin, getServerOrigin)
  const [copied, setCopied] = useState(false)

  const link = origin ? `${origin}/b/${barbershopId}` : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Sem permissão para a área de transferência: o campo continua selecionável
    }
  }

  return (
    <div className="grid max-w-xl gap-3 rounded-[14px] border bg-card p-6">
      <div>
        <h2 className="font-semibold">Link de agendamento</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Envie este link aos seus clientes para eles agendarem sozinhos.
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="booking-link">Seu link</Label>
        <div className="flex gap-2">
          <Input
            id="booking-link"
            readOnly
            value={link}
            onFocus={(event) => event.currentTarget.select()}
          />
          <Button type="button" variant="outline" onClick={handleCopy} disabled={!link}>
            {copied ? <Check /> : <Copy />}
            {copied ? 'Copiado' : 'Copiar'}
          </Button>
        </div>
      </div>
    </div>
  )
}