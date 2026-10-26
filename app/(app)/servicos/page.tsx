'use client'

import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'

import { DeleteServiceDialog } from '@/components/delete-service-dialog'
import { ServiceForm } from '@/components/service-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useServices } from '@/hooks/use-services'
import { formatCurrency } from '@/lib/format'
import type { ApiService } from '@/types/api'

interface ServicesListProps {
  onEdit: (service: ApiService) => void
  onDelete: (service: ApiService) => void
}

function ServicesList({ onEdit, onDelete }: ServicesListProps) {
  const { data: services, isPending, isError, error } = useServices()

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Carregando serviços...</p>
  }

  if (isError) {
    return (
      <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {error.message}
      </p>
    )
  }

  if (services.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum serviço cadastrado ainda.</p>
  }

  return (
    <ul className="grid gap-3">
      {services.map((service) => (
        <li
          key={service.id}
          className="flex items-center justify-between gap-4 rounded-[14px] border bg-card p-4"
        >
          <div>
            <p className="font-medium">{service.name}</p>
            <p className="text-sm text-muted-foreground">{service.durationMins} min</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-semibold">{formatCurrency(service.price)}</p>
              {!service.active && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  Inativo
                </span>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Editar ${service.name}`}
                onClick={() => onEdit(service)}
              >
                <Pencil />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Excluir ${service.name}`}
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(service)}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function ServicosPage() {
  // Modal de criar/editar
  const [formOpen, setFormOpen] = useState(false)
  // null = modo criar; um serviço = modo editar
  const [editingService, setEditingService] = useState<ApiService | null>(null)

  // Modal de confirmação de exclusão
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingService, setDeletingService] = useState<ApiService | null>(null)

  const openCreate = () => {
    setEditingService(null)
    setFormOpen(true)
  }

  const openEdit = (service: ApiService) => {
    setEditingService(service)
    setFormOpen(true)
  }

  const openDelete = (service: ApiService) => {
    setDeletingService(service)
    setDeleteOpen(true)
  }

  return (
    <div className="grid gap-6">
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus />
          Adicionar serviço
        </Button>
      </div>

      <ServicesList onEdit={openEdit} onDelete={openDelete} />

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService ? 'Editar serviço' : 'Novo serviço'}</DialogTitle>
            <DialogDescription>
              {editingService
                ? 'Altere os dados e salve.'
                : 'Preencha os dados do novo serviço.'}
            </DialogDescription>
          </DialogHeader>
          <ServiceForm
            key={editingService?.id ?? 'novo'}
            service={editingService ?? undefined}
            onDone={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <DeleteServiceDialog
        service={deletingService}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  )
}