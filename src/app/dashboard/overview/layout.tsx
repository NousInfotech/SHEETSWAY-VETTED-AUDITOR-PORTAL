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
import { useProfileStore } from '@/stores/useProfileStore';
import {
  IconBriefcase,
  IconClipboardList,
  IconMessageCircle,
  IconUserCheck
} from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

// Renamed from OverViewLayout to DashboardComponent as requested.
export default function DashboardComponent({
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
  const { user, loading: AuthLoading } = useAuth();
  
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4 pb-10'>
        {/* Main Heading & Welcome Message */}
        <div className='flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-3xl font-extrabold tracking-tight'>
              Auditor Dashboard
            </h2>
            <p className='text-muted-foreground'>
              Welcome back, {user?.displayName || 'Auditor'}. Here's your
              overview.
            </p>
          </div>
        </div>

        {/* Summary Cards for Main Sections (as per Spec) */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {/* 1. Engagement Requests (Bids Center) */}
          <Card>
            <CardHeader>
              <CardDescription>Engagement Requests</CardDescription>
              <CardTitle className='text-3xl font-semibold'>70+</CardTitle>
              <CardAction>
                <IconBriefcase className='text-muted-foreground' />
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-2'>
              <Link href='/dashboard/request'>
                <Button size='sm'>View Bids Center</Button>
              </Link>
              <p className='text-muted-foreground text-sm'>
                Find and bid on new audit & tax opportunities.
              </p>
            </CardFooter>
          </Card>

          {/* 2. Active Engagements */}
          <Card>
            <CardHeader>
              <CardDescription>Active Engagements</CardDescription>
              <CardTitle className='text-3xl font-semibold'>12</CardTitle>
              <CardAction>
                <IconClipboardList className='text-muted-foreground' />
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-2'>
              <Link href='/dashboard/engagements'>
                <Button size='sm'>Manage Engagements</Button>
              </Link>
              <p className='text-muted-foreground text-sm'>
                Access workspaces for all your ongoing projects.
              </p>
            </CardFooter>
          </Card>

          {/* 3. Messaging & Meetings */}
          <Card>
            <CardHeader>
              <CardDescription>Messaging & Meetings</CardDescription>
              <CardTitle className='text-3xl font-semibold'>5 Unread</CardTitle>
              <CardAction>
                <IconMessageCircle className='text-muted-foreground' />
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-2'>
              <Link href='/dashboard/connect'>
                <Button size='sm'>Open Inbox</Button>
              </Link>
              <p className='text-muted-foreground text-sm'>
                Communicate with clients and schedule calls.
              </p>
            </CardFooter>
          </Card>

          {/* 4. Profile & Compliance Settings */}
          <Card>
            <CardHeader>
              <CardDescription>Profile & Compliance</CardDescription>
              <CardTitle className='flex items-center gap-2 text-2xl font-semibold'>
                Verified <Badge variant='secondary'>OK</Badge>
              </CardTitle>
              <CardAction>
                <IconUserCheck className='text-muted-foreground' />
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-2'>
              <Link href='/dashboard/profile'>
                <Button size='sm'>Update Profile</Button>
              </Link>
              <p className='text-muted-foreground text-sm'>
                Manage your firm's details and compliance documents.
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* QUICK ACTIONS */}
        <div className='pt-6 pb-2'>
          <h3 className='mb-4 text-xl font-semibold tracking-tight'>
            Quick Actions
          </h3>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            <Button asChild variant='outline' className='w-full'>
              <Link href='/dashboard/request'>Find New Engagements</Link>
            </Button>
            <Button asChild variant='outline' className='w-full'>
              <Link href='/dashboard/engagements'>
                Manage Active Engagements
              </Link>
            </Button>
            <Button asChild variant='outline' className='w-full'>
              <Link href='/dashboard/connect'>Go to Inbox</Link>
            </Button>
            <Button asChild variant='outline' className='w-full'>
              <Link href='/dashboard/profile'>Update Compliance</Link>
            </Button>
          </div>
        </div>

        {/* CHARTS & DATA VISUALIZATION SECTION */}
        {/* This section can be used to display relevant metrics for the auditor */}
        <div className='grid grid-cols-1 gap-4 pt-4 lg:grid-cols-7'>
          {/* Example: Bar chart for proposals submitted vs won */}
          <div className='lg:col-span-4'>{bar_stats}</div>
          {/* Example: List of recent activities or deadlines */}
          <div className='lg:col-span-3'>{sales}</div>
          {/* Example: Area chart for revenue over time */}
          <div className='lg:col-span-4'>{area_stats}</div>
          {/* Example: Pie chart for engagement type (Audit vs. Tax) */}
          <div className='lg:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
