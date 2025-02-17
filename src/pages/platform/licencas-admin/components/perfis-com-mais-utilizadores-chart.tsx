import { useGetPerfis } from '@/pages/platform/perfis-admin/queries/perfis-admin-queries'
import { LicencaDTO } from '@/types/dtos/licenca.dto'
import { PieChart, Pie, ResponsiveContainer, Label } from 'recharts'
import { PREDEFINED_COLORS } from '@/lib/constants/colors'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface PerfilDTO {
  id?: string
  nome?: string
  ativo?: boolean
  licenca: LicencaDTO
  createdOn: Date
}

interface PerfilCount {
  name: string
  value: number
  fill: string
}

export function PerfisComMaisUtilizadoresChart() {
  const { data: perfisResponse, isLoading, error } = useGetPerfis()
  const perfis = perfisResponse || []

  if (isLoading) {
    return (
      <div className='flex h-[350px] items-center justify-center'>
        <p>Carregando dados...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex h-[350px] items-center justify-center'>
        <p className='text-destructive'>Erro ao carregar dados</p>
      </div>
    )
  }

  const processedData = perfis.reduce<PerfilCount[]>((acc, perfil) => {
    if (perfil.ativo) {
      acc.push({
        name: perfil.nome || 'Sem nome',
        value: 1,
        fill: PREDEFINED_COLORS[acc.length % PREDEFINED_COLORS.length].value,
      })
    }
    return acc
  }, [])

  const topPerfis = processedData
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map((perfil) => ({
      ...perfil,
      name:
        perfil.name.length > 20
          ? `${perfil.name.slice(0, 20)}...`
          : perfil.name,
    }))

  const chartConfig = topPerfis.reduce(
    (acc, perfil) => {
      acc[perfil.name] = {
        label: perfil.name,
        color: perfil.fill,
      }
      return acc
    },
    {
      value: {
        label: 'Perfis',
      },
    } as Record<string, { label: string; color?: string }>
  )

  const totalPerfis = topPerfis.reduce((sum, item) => sum + item.value, 0)

  return (
    <div>
      <div className='p-4 border-b flex flex-col justify-center'>
        <h3 className='text-sm font-medium'>Distribuição por Perfil</h3>
        <p className='text-xs text-muted-foreground'>
          Top 5 perfis com mais utilizadores
        </p>
      </div>
      <CardContent>
        <ResponsiveContainer width='100%' height={300}>
          <ChartContainer
            config={chartConfig}
            className='mx-auto aspect-square max-h-[250px]'
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={topPerfis}
                dataKey='value'
                nameKey='name'
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor='middle'
                          dominantBaseline='middle'
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className='fill-foreground text-3xl font-bold'
                          >
                            {totalPerfis.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className='fill-muted-foreground'
                          >
                            Perfis
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </div>
  )
}
