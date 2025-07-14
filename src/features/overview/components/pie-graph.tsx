'use client';

import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartData = [
  { type: 'Audit', value: 60, fill: 'var(--primary)' },
  { type: 'Tax', value: 40, fill: 'var(--primary-light)' }
];

const chartConfig = {
  value: {
    label: 'Engagements'
  },
  Audit: {
    label: 'Audit',
    color: 'var(--primary)'
  },
  Tax: {
    label: 'Tax',
    color: 'var(--primary-light)'
  }
} satisfies ChartConfig;

export function PieGraph() {
  const total = React.useMemo(() => chartData.reduce((acc, curr) => acc + curr.value, 0), []);
  return (
    <Card className='@container/card h-full'>
      <CardHeader>
        <CardTitle>Engagement Types Distribution</CardTitle>
        <CardDescription>Audit vs. Tax engagements (last 6 months)</CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square h-[250px]'>
          <PieChart>
            <Pie
              data={chartData}
              dataKey='value'
              nameKey='type'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = 25 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                  <text x={x} y={y} fill='#888' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
                    {`${chartData[index].type}: ${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex gap-4 text-sm'>
        <span className='flex items-center gap-2'><span className='inline-block w-3 h-3 rounded-full' style={{background:'var(--primary)'}}></span> Audit</span>
        <span className='flex items-center gap-2'><span className='inline-block w-3 h-3 rounded-full' style={{background:'var(--primary-light)'}}></span> Tax</span>
      </CardFooter>
    </Card>
  );
}
