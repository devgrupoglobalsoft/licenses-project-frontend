import { useState } from 'react'
import { PerfilDTO } from '@/types/dtos'
import { Edit, Trash } from 'lucide-react'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { EnhancedModal } from '@/components/ui/enhanced-modal'
import { AlertModal } from '@/components/shared/alert-modal'
import { useDeletePerfil } from '../../queries/perfis-admin-mutations'
import PerfilUpdateForm from '../perfis-admin-forms/perfil-admin-update-form'

interface CellActionProps {
  data: PerfilDTO
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedPerfil, setSelectedPerfil] = useState<PerfilDTO | null>(null)

  const deletePerfilMutation = useDeletePerfil()

  const handleDeleteConfirm = async () => {
    try {
      await deletePerfilMutation.mutateAsync(data.id || '')
      toast.success('Perfil removido com sucesso')
    } catch (error) {
      toast.error('Erro ao remover o perfil')
    } finally {
      setOpen(false)
    }
  }

  const handleUpdateClick = (perfil: PerfilDTO) => {
    setSelectedPerfil(perfil)
    setIsUpdateModalOpen(true)
  }

  return (
    <>
      <EnhancedModal
        title='Atualizar Perfil'
        description='Atualize os dados do perfil'
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        size='md'
      >
        {selectedPerfil && (
          <PerfilUpdateForm
            modalClose={() => setIsUpdateModalOpen(false)}
            perfilId={selectedPerfil.id || ''}
            initialData={{
              nome: selectedPerfil.nome,
              ativo: selectedPerfil.ativo,
            }}
          />
        )}
      </EnhancedModal>

      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deletePerfilMutation.isPending}
      />

      <div className='flex items-center gap-2'>
        <Button
          onClick={() => handleUpdateClick(data)}
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <Edit color='hsl(var(--primary))' className='h-4 w-4' />
          <span className='sr-only'>Atualizar</span>
        </Button>
        <Button
          onClick={() => setOpen(true)}
          variant='ghost'
          className='h-8 w-8 p-0'
        >
          <Trash color='hsl(var(--destructive))' className='h-4 w-4' />
          <span className='sr-only'>Apagar</span>
        </Button>
      </div>
    </>
  )
}
