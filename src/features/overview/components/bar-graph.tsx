'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'An interactive bar chart';

const chartData = [
  { month: 'Jan', requests: 12 },
  { month: 'Feb', requests: 18 },
  { month: 'Mar', requests: 22 },
  { month: 'Apr', requests: 15 },
  { month: 'May', requests: 25 },
  { month: 'Jun', requests: 20 }
];

const chartConfig = {
  requests: {
    label: 'Requests',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function BarGraph() {
  return (
    <Card className='@container/card !pt-3'>
      <CardHeader>
        <CardTitle>Engagement Requests per Month</CardTitle>
        <CardDescription>Last 6 months</CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer config={chartConfig} className='aspect-auto h-[250px] w-full'>
          <BarChart data={chartData} height={250} width={400}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} />
            <Bar dataKey='requests' fill='var(--primary)' barSize={40} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
