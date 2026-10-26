'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useDeleteServices } from '@/hooks/use-services'
import { ApiError } from '@/lib/api-client'
import type { ApiService } from '@/types/api'

interface DeleteServiceDialogProps {
  service: ApiService | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteServiceDialog({ service, open, onOpenChange }: DeleteServiceDialogProps) {
  const deleteService = useDeleteServices()

  const handleOpenChange = (nextOpen: boolean) => {
    // Ao fechar, limpa um eventual erro da tentativa anterior
    if (!nextOpen) deleteService.reset()
    onOpenChange(nextOpen)
  }

  const handleConfirm = () => {
    if (!service) return
    deleteService.mutate(service.id, { onSuccess: () => handleOpenChange(false) })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Excluir serviço?</DialogTitle>
          <DialogDescription>
            {service
              ? `"${service.name}" será removido permanentemente. Essa ação não pode ser desfeita.`
              : ''}
          </DialogDescription>
        </DialogHeader>

        {deleteService.isError && (
          <p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {deleteService.error instanceof ApiError
              ? deleteService.error.message
              : 'Não foi possível excluir o serviço.'}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={deleteService.isPending}
          >
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={deleteService.isPending}>
            {deleteService.isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}