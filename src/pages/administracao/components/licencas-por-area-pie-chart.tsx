'use client'

import * as React from 'react'
import { subDays } from 'date-fns'
import { useGetLicencas } from '@/pages/platform/licencas/queries/licencas-queries'
import { Label, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { getAreaColors } from '@/lib/constants/area-colors'
import {
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

interface AreaCount {
  name: string
  value: number
  fill: string
}

export function LicencasPorAreaPieChart() {
  const { data: licencasResponse, isLoading, error } = useGetLicencas()
  const licencas = licencasResponse?.info?.data || []

  const totalLicencas = React.useMemo(() => {
    if (!licencas.length) return 0
    return licencas.reduce((acc) => acc + 1, 0)
  }, [licencas])

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

  const thirtyDaysAgo = subDays(new Date(), 30)
  const recentLicencas = licencas.filter(
    (lic) => lic.dataInicio && new Date(lic.dataInicio) >= thirtyDaysAgo
  )

  const processedData = recentLicencas.reduce<AreaCount[]>((acc, lic) => {
    const areaName = lic.aplicacao?.area?.nome || 'Sem área'
    const existingArea = acc.find((item) => item.name === areaName)

    if (existingArea) {
      existingArea.value++
    } else {
      acc.push({
        name: areaName,
        value: 1,
        fill: '', // Will be set later by getAreaColors
      })
    }
    return acc
  }, [])

  const topAreas = processedData
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map((area) => ({
      ...area,
      name: area.name.length > 20 ? `${area.name.slice(0, 20)}...` : area.name,
    }))

  const areaNames = topAreas.map((area) => area.name)
  const colors = getAreaColors(areaNames)

  // Map colors to data
  const chartData = topAreas.map((area, index) => ({
    ...area,
    fill: colors[index],
  }))

  const chartConfig = areaNames.reduce(
    (acc, name, index) => {
      acc[name] = {
        label: name,
        color: colors[index],
      }
      return acc
    },
    {
      value: {
        label: 'Licenças',
      },
    } as Record<string, { label: string; color?: string }>
  )

  return (
    <div>
      <CardHeader>
        <CardTitle>Distribuição de Licenças por Área</CardTitle>
        <CardDescription>Últimos 30 dias</CardDescription>
      </CardHeader>
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
                data={chartData}
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
                            {totalLicencas.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className='fill-muted-foreground'
                          >
                            Licenças
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
