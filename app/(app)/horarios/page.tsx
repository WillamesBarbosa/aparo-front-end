'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useSaveSchedule, useSchedules } from '@/hooks/use-schedules'
import { DAYS_OF_WEEK } from '@/lib/days'
import { ApiError } from '@/lib/api-client'
import type { ApiSchedule } from '@/types/api'

const DEFAULT_OPEN = '09:00'
const DEFAULT_CLOSE = '18:00'

// Aceita "08:00" ou "08:00:00" e devolve sempre "08:00" (formato do input type="time")
const toHHmm = (time: string) => time.slice(0, 5)

interface ScheduleRowProps {
  day: { value: ApiSchedule['dayOfWeek']; label: string }
  schedule?: ApiSchedule
}

function ScheduleRow({ day, schedule }: ScheduleRowProps) {
  const saveSchedule = useSaveSchedule()

  // O que está salvo no servidor (dia sem registro = fechado)
  const saved = {
    active: schedule?.active ?? false,
    openTime: schedule ? toHHmm(schedule.openTime) : DEFAULT_OPEN,
    closeTime: schedule ? toHHmm(schedule.closeTime) : DEFAULT_CLOSE,
  }

  // O que o barbeiro está editando na tela
  const [active, setActive] = useState(saved.active)
  const [openTime, setOpenTime] = useState(saved.openTime)
  const [closeTime, setCloseTime] = useState(saved.closeTime)

  const isDirty =
    active !== saved.active || openTime !== saved.openTime || closeTime !== saved.closeTime
  const isInvalid = active && closeTime <= openTime

  const handleSave = () => {
    saveSchedule.mutate({ dayOfWeek: day.value, openTime, closeTime, active })
  }

  return (
    <li className="rounded-[14px] border bg-card p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex w-44 items-center gap-3">
          <Switch
            checked={active}
            onCheckedChange={setActive}
            aria-label={`${active ? 'Fechar' : 'Abrir'} ${day.label}`}
          />
          <span className="font-medium">{day.label}</span>
        </div>

        {active ? (
          <div className="flex items-center gap-2">
            <Input
              type="time"
              className="w-32"
              value={openTime}
              onChange={(event) => setOpenTime(event.target.value)}
              aria-label={`Abertura de ${day.label}`}
            />
            <span className="text-sm text-muted-foreground">até</span>
            <Input
              type="time"
              className="w-32"
              value={closeTime}
              onChange={(event) => setCloseTime(event.target.value)}
              aria-label={`Fechamento de ${day.label}`}
            />
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Fechado</span>
        )}

        <div className="ml-auto">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || isInvalid || saveSchedule.isPending}
          >
            {saveSchedule.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      {isInvalid && (
        <p className="mt-2 text-xs text-destructive">
          O fechamento precisa ser depois da abertura.
        </p>
      )}
      {saveSchedule.isError && (
        <p className="mt-2 text-xs text-destructive">
          {saveSchedule.error instanceof ApiError
            ? saveSchedule.error.message
            : 'Não foi possível salvar o horário.'}
        </p>
      )}
    </li>
  )
}

export default function HorariosPage() {
  const { data: schedules, isPending, isError, error } = useSchedules()

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Carregando horários...</p>
  }

  if (isError) {
    return (
      <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {error.message}
      </p>
    )
  }

  return (
    <ul className="grid gap-3">
      {DAYS_OF_WEEK.map((day) => (
        <ScheduleRow
          key={day.value}
          day={day}
          schedule={schedules.find((schedule) => schedule.dayOfWeek === day.value)}
        />
      ))}
    </ul>
  )
}