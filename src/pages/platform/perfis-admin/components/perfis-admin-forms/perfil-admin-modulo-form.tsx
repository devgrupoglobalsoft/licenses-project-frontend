import { useEffect, useState } from 'react'
import { useGetModulosFuncionalidadesLicenca } from '@/pages/platform/licencas/queries/licencas-funcionalidades-queries'
import { PerfilFuncionalidadeDTO } from '@/types/dtos/perfil.dto'
import { Tree } from 'antd'
import type { TreeDataNode, TreeProps } from 'antd'
import { getErrorMessage, handleApiError } from '@/utils/error-handlers'
import { toast } from '@/utils/toast-utils'
import { Button } from '@/components/ui/button'
import { useUpdatePerfilFuncionalidades } from '../../queries/perfis-admin-mutations'
import { useGetPerfisModulosFuncionalidades } from '../../queries/perfis-admin-queries'

interface AuthProps {
  authVer: boolean
  authAdd: boolean
  authChg: boolean
  authDel: boolean
  authPrt: boolean
}

interface ExtendedTreeDataNode extends TreeDataNode {
  authProps?: AuthProps
  type?: 'modulo' | 'funcionalidade' | 'permission'
}

interface PerfilAdminModulosFormProps {
  perfilId: string
  licencaId: string
  modalClose: () => void
}

export default function PerfilAdminModulosForm({
  perfilId,
  licencaId,
  modalClose,
}: PerfilAdminModulosFormProps) {
  const [treeData, setTreeData] = useState<ExtendedTreeDataNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)

  const { data: licencaModulosFuncionalidades } =
    useGetModulosFuncionalidadesLicenca(licencaId)
  const { data: savedModulosFuncionalidades } =
    useGetPerfisModulosFuncionalidades(perfilId)
  const updatePerfilModulosFuncionalidades = useUpdatePerfilFuncionalidades()

  useEffect(() => {
    console.log(licencaModulosFuncionalidades)
    if (licencaModulosFuncionalidades?.modulos) {
      const transformedData = licencaModulosFuncionalidades.modulos.map(
        (modulo) => ({
          title: modulo.nome,
          key: modulo.id,
          type: 'modulo',
          children: licencaModulosFuncionalidades.funcionalidades
            .filter((func) => func.moduloId === modulo.id)
            .map((func) => ({
              title: func.nome,
              key: func.id,
              type: 'funcionalidade',
              children: [
                {
                  title: 'Ver',
                  key: `${func.id}-ver`,
                  type: 'permission',
                },
                {
                  title: 'Adicionar',
                  key: `${func.id}-add`,
                  type: 'permission',
                },
                {
                  title: 'Alterar',
                  key: `${func.id}-chg`,
                  type: 'permission',
                },
                {
                  title: 'Apagar',
                  key: `${func.id}-del`,
                  type: 'permission',
                },
                {
                  title: 'Imprimir',
                  key: `${func.id}-prt`,
                  type: 'permission',
                },
              ],
            })),
        })
      )
      setTreeData(transformedData as ExtendedTreeDataNode[])
    }
  }, [licencaModulosFuncionalidades])

  useEffect(() => {
    console.log(savedModulosFuncionalidades)
    if (savedModulosFuncionalidades?.modulos) {
      const checkedKeys: string[] = []

      savedModulosFuncionalidades.modulos.forEach((modulo) => {
        modulo.funcionalidades.forEach((func) => {
          if (func.authVer) checkedKeys.push(`${func.funcionalidadeId}-ver`)
          if (func.authAdd) checkedKeys.push(`${func.funcionalidadeId}-add`)
          if (func.authChg) checkedKeys.push(`${func.funcionalidadeId}-chg`)
          if (func.authDel) checkedKeys.push(`${func.funcionalidadeId}-del`)
          if (func.authPrt) checkedKeys.push(`${func.funcionalidadeId}-prt`)
        })
      })

      setCheckedKeys(checkedKeys)

      // Set expanded keys to show all modules initially
      const expandedModulos = savedModulosFuncionalidades.modulos.map(
        (modulo) => modulo.moduloId
      )
      setExpandedKeys(expandedModulos)
    }
  }, [savedModulosFuncionalidades])

  const onExpand: TreeProps['onExpand'] = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue)
    setAutoExpandParent(false)
  }

  const onCheck: TreeProps['onCheck'] = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue as React.Key[])
  }

  const handleSave = async () => {
    try {
      // Create a map to store permissions by funcionalidadeId
      const permissionsByFunc = new Map<string, PerfilFuncionalidadeDTO>()

      // Process each checked key
      checkedKeys.forEach((key) => {
        const keyStr = key.toString()

        // Find the corresponding funcionalidade in the tree data
        for (const modulo of treeData) {
          const funcionalidade = modulo.children?.find((func) =>
            func.children?.some((perm) => perm.key === keyStr)
          )

          if (funcionalidade) {
            const funcId = funcionalidade.key as string

            // Get or create permission object for this funcionalidade
            let funcPermissions = permissionsByFunc.get(funcId)
            if (!funcPermissions) {
              funcPermissions = {
                perfilId,
                funcionalidadeId: funcId,
                authVer: false,
                authAdd: false,
                authChg: false,
                authDel: false,
                authPrt: false,
              }
              permissionsByFunc.set(funcId, funcPermissions)
            }

            // Find which permission was checked
            const permission = funcionalidade.children?.find(
              (perm) => perm.key === keyStr
            )
            if (permission) {
              const permKey = permission.key as string
              if (permKey.endsWith('-ver')) funcPermissions.authVer = true
              if (permKey.endsWith('-add')) funcPermissions.authAdd = true
              if (permKey.endsWith('-chg')) funcPermissions.authChg = true
              if (permKey.endsWith('-del')) funcPermissions.authDel = true
              if (permKey.endsWith('-prt')) funcPermissions.authPrt = true
            }

            break // Found the funcionalidade, no need to continue searching
          }
        }
      })

      // Convert map values to array
      const updateData = Array.from(permissionsByFunc.values())

      console.log('Update data:', updateData)

      const response = await updatePerfilModulosFuncionalidades.mutateAsync({
        perfilId,
        data: updateData,
      })

      if (response.info.succeeded) {
        toast.success('Configuração guardada com sucesso')
        modalClose()
      } else {
        toast.error(getErrorMessage(response, 'Erro ao guardar configuração'))
      }
    } catch (error) {
      toast.error(handleApiError(error, 'Erro ao guardar configuração'))
    }
  }

  return (
    <div className='space-y-6'>
      <div className='border rounded-md p-4'>
        {treeData.length > 0 ? (
          <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={treeData}
            className='bg-transparent'
          />
        ) : (
          <div className='flex items-center justify-center p-4 text-muted-foreground'>
            Não existem módulos e funcionalidades disponíveis para a aplicação.
          </div>
        )}
      </div>

      <div className='flex justify-end space-x-2'>
        <Button variant='outline' onClick={modalClose}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>Guardar</Button>
      </div>
    </div>
  )
}
