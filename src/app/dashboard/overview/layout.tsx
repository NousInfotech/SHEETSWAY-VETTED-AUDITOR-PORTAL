'use client';

import PageContainer from '@/components/layout/page-container';
import { useAuth } from '@/components/layout/providers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { auth } from '@/lib/firebase';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

export default function OverViewLayout({
  sales,
  pie_stats,
  bar_stats,
  area_stats
}: {
  sales: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  const buttons = [
    {
      name: 'Create Audit/Tax Request',
      link: '/'
    },

    {
      name: 'UploadFiles',
      link: '/'
    },
    {
      name: 'Last Created Job',
      link: '/'
    },
    {
      name: 'Schedule Meeting',
      link: '/'
    },
    {
      name: 'Contact&Support',
      link: '/'
    }
  ];

  const { user } = useAuth();

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        {/* Main Heading */}
        <div className='flex items-center justify-between space-y-2'>
          <h2 className='text-3xl font-extrabold tracking-tight'>
            SHEETSWAY — VETTED AUDITOR PORTAL DASHBOARD
          </h2>
        </div>

        {/* Summary Cards for Main Sections */}
        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
          {/* Engagement Requests (Bids Center) */}
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Engagement Requests (Bids Center)</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                70
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  New Requests
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <Link href='/dashboard/engagements'>
                <Button size='sm' variant='outline'>View Bids Center</Button>
              </Link>
              <div className='text-muted-foreground'>
                Search, filter, and submit proposals for live client requests
              </div>
            </CardFooter>
          </Card>
          {/* Active Engagements */}
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Active Engagements</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                10
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  Ongoing
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <Link href='/dashboard/engagements'>
                <Button size='sm' variant='outline'>View Engagements</Button>
              </Link>
              <div className='text-muted-foreground'>
                Track and manage your current projects
              </div>
            </CardFooter>
          </Card>
          {/* Messaging & Meetings */}
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Messaging & Meetings</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                <span role='img' aria-label='calendar'>💬</span>
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  Messages
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <Link href='/dashboard/connect'>
                <Button size='sm' variant='outline'>Open Messaging</Button>
              </Link>
              <div className='text-muted-foreground'>
                Communicate and schedule meetings with clients
              </div>
            </CardFooter>
          </Card>
          {/* Profile & Compliance Settings */}
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Profile & Compliance Settings</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                <span role='img' aria-label='profile'>🛡️</span>
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <IconTrendingUp />
                  Compliance
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <Link href='/dashboard/profile'>
                <Button size='sm' variant='outline'>Edit Profile</Button>
              </Link>
              <div className='text-muted-foreground'>
                Manage your firm details, team, and compliance
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* QUICK ACTIONS */}
        <div className='my-10'>
          <h3 className='font-semibold'>QUICK ACTIONS</h3>
          <div className='my-5 flex w-full flex-col items-center justify-center gap-10 px-5 md:flex-row md:justify-around md:overflow-x-auto md:px-0 md:whitespace-nowrap'>
            <Button asChild variant='secondary' className='w-full px-8 whitespace-nowrap hover:border-2 hover:shadow sm:w-3/4 md:w-auto'>
              <Link href='/dashboard/engagements'>Submit Proposal</Link>
            </Button>
            <Button asChild variant='secondary' className='w-full px-8 whitespace-nowrap hover:border-2 hover:shadow sm:w-3/4 md:w-auto'>
              <Link href='/dashboard/engagements'>View Engagements</Link>
            </Button>
            <Button asChild variant='secondary' className='w-full px-8 whitespace-nowrap hover:border-2 hover:shadow sm:w-3/4 md:w-auto'>
              <Link href='/dashboard/connect'>Open Messaging</Link>
            </Button>
            <Button asChild variant='secondary' className='w-full px-8 whitespace-nowrap hover:border-2 hover:shadow sm:w-3/4 md:w-auto'>
              <Link href='/dashboard/profile'>Edit Profile</Link>
            </Button>
          </div>
        </div>

        {/* CHARTS BELOW */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
          <div className='col-span-4'>{bar_stats}</div>
          <div className='col-span-4 md:col-span-3'>
            {/* sales arallel routes */}
            {sales}
          </div>
          <div className='col-span-4'>{area_stats}</div>
          <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
