'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
    color: 'hsl(var(--primary))'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const totalRequests = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.requests, 0);
  }, []);

  return (
    <Card className='flex h-full w-full flex-col'>
      <CardHeader>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <CardTitle>Engagement Requests</CardTitle>
            <CardDescription>
              Performance over the last 6 months
            </CardDescription>
          </div>
          <div className='text-right'>
            <div className='text-3xl font-bold'>{totalRequests}</div>
            <p className='text-muted-foreground text-xs'>Total Requests</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className='flex-grow pr-2 pb-4'>
        {/* ChartContainer handles responsiveness automatically */}
        <ChartContainer config={chartConfig} className='h-full w-full'>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -10,
              bottom: 0
            }}
          >
            <defs>
              <linearGradient id='fillRequests' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-requests)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-requests)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray='3 3' />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke='#888888'
              fontSize={12}
            />
            <ChartTooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey='requests'
              fill='url(#fillRequests)'
              radius={[5, 5, 0, 0]}
              // This connects the bar color to the chartConfig for tooltips
              style={
                {
                  '--color-requests': 'hsl(var(--primary))'
                } as React.CSSProperties
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
