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
import { Switch } from '@/components/ui/switch'
import { useServices, useUpdateServices } from '@/hooks/use-services'
import { formatCurrency } from '@/lib/format'
import type { ApiService } from '@/types/api'

interface ServicesListProps {
  onEdit: (service: ApiService) => void
  onDelete: (service: ApiService) => void
}

function ServiceItem({
  service,
  onEdit,
  onDelete,
}: {
  service: ApiService
  onEdit: (service: ApiService) => void
  onDelete: (service: ApiService) => void
}) {
  // Um hook por item: cada linha controla o próprio "salvando" e o próprio erro
  const updateService = useUpdateServices()

  const handleToggle = (checked: boolean) => {
    updateService.mutate({ id: service.id, payload: { active: checked } })
  }

  return (
    <li className="rounded-[14px] border bg-card p-4">
      <div className="flex items-center justify-between gap-4">
        <div className={service.active ? '' : 'opacity-60'}>
          <p className="font-medium">{service.name}</p>
          <p className="text-sm text-muted-foreground">{service.durationMins} min</p>
        </div>
        <div className="flex items-center gap-3">
          <p className={`font-semibold ${service.active ? '' : 'opacity-60'}`}>
            {formatCurrency(service.price)}
          </p>
          <Switch
            checked={service.active}
            onCheckedChange={handleToggle}
            disabled={updateService.isPending}
            aria-label={`${service.active ? 'Desativar' : 'Ativar'} ${service.name}`}
          />
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
      </div>
      {updateService.isError && (
        <p className="mt-2 text-xs text-destructive">
          Não foi possível alterar o status do serviço.
        </p>
      )}
    </li>
  )
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
        <ServiceItem key={service.id} service={service} onEdit={onEdit} onDelete={onDelete} />
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