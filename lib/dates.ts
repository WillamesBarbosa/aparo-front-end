// Convenção do backend do Aparo: o horário em UTC é tratado como o horário LOCAL
// da barbearia (ex: "2026-09-07T09:00:00.000Z" significa 09:00 na barbearia).
// Por isso, aqui nunca convertemos fuso: montamos e lemos o horário "como está".

import type { DayOfWeek } from '@/types/api'

const pad = (value: number) => String(value).padStart(2, '0')

// "YYYY-MM-DD" a partir do calendário LOCAL do navegador.
// Não usar toISOString() aqui: ele converte para UTC e, depois das 21h no Recife,
// já devolveria o dia seguinte.
export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function todayKey(): string {
  return toDateKey(new Date())
}

// Os próximos `count` dias (começando em hoje), como "YYYY-MM-DD"
export function nextDayKeys(count: number): string[] {
  const now = new Date()
  return Array.from({ length: count }, (_, index) =>
    toDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() + index)),
  )
}

// Monta o ISO que o backend espera a partir do dia e do slot escolhidos
export function buildAppointmentDate(dateKey: string, slot: string): string {
  return `${dateKey}T${slot}:00.000Z`
}

// "09:00" a partir do ISO do agendamento, sem conversão de fuso
export function formatAppointmentTime(iso: string): string {
  return iso.slice(11, 16)
}

// Interpreta "YYYY-MM-DD" como data de calendário (meio-dia UTC evita virada de dia)
function parseDateKey(dateKey: string): Date {
  return new Date(`${dateKey}T12:00:00.000Z`)
}

const WEEKDAYS: DayOfWeek[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
]

export function dayOfWeekFromKey(dateKey: string): DayOfWeek {
  return WEEKDAYS[parseDateKey(dateKey).getUTCDay()]
}

// "ter 27" (rótulo curto para os botões de dia)
export function formatDayShort(dateKey: string): { weekday: string; day: string } {
  const date = parseDateKey(dateKey)
  return {
    weekday: date.toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'UTC' }).replace('.', ''),
    day: String(date.getUTCDate()),
  }
}

// "terça-feira, 27 de outubro"
export function formatDayLong(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
}