// 'use client';

// import PageContainer from '@/components/layout/page-container';
// import { useAuth } from '@/components/layout/providers';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardAction,
//   CardFooter
// } from '@/components/ui/card';
// import { auth } from '@/lib/firebase';
// import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';
// import Link from 'next/link';
// import React from 'react';

// export default function OverViewLayout({
//   sales,
//   pie_stats,
//   bar_stats,
//   area_stats
// }: {
//   sales: React.ReactNode;
//   pie_stats: React.ReactNode;
//   bar_stats: React.ReactNode;
//   area_stats: React.ReactNode;
// }) {
//   const buttons = [
//     {
//       name: 'Create Audit/Tax Request',
//       link: '/'
//     },

//     {
//       name: 'UploadFiles',
//       link: '/'
//     },
//     {
//       name: 'Last Created Job',
//       link: '/'
//     },
//     {
//       name: 'Schedule Meeting',
//       link: '/'
//     },
//     {
//       name: 'Contact&Support',
//       link: '/'
//     }
//   ];

//   const { user } = useAuth();

//   return (
//     <PageContainer>
//       <div className='flex flex-1 flex-col space-y-2'>
//         {/* Main Heading */}
//         <div className='flex items-center justify-between space-y-2'>
//           <h2 className='text-3xl font-extrabold tracking-tight'>
//             SHEETSWAY — VETTED AUDITOR PORTAL DASHBOARD
//           </h2>
//         </div>

//         {/* Summary Cards for Main Sections */}
//         <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4'>
//           {/* Engagement Requests (Bids Center) */}
//           <Card className='@container/card'>
//             <CardHeader>
//               <CardDescription>Engagement Requests (Bids Center)</CardDescription>
//               <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
//                 70
//               </CardTitle>
//               <CardAction>
//                 <Badge variant='outline'>
//                   <IconTrendingUp />
//                   New Requests
//                 </Badge>
//               </CardAction>
//             </CardHeader>
//             <CardFooter className='flex-col items-start gap-1.5 text-sm'>
//               <Link href='/dashboard/engagements'>
//                 <Button size='sm' variant='outline'>View Bids Center</Button>
//               </Link>
//               <div className='text-muted-foreground'>
//                 Search, filter, and submit proposals for live client requests
//               </div>
//             </CardFooter>
//           </Card>
//           {/* Active Engagements */}
//           <Card className='@container/card'>
//             <CardHeader>
//               <CardDescription>Active Engagements</CardDescription>
//               <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
//                 10
//               </CardTitle>
//               <CardAction>
//                 <Badge variant='outline'>
//                   <IconTrendingUp />
//                   Ongoing
//                 </Badge>
//               </CardAction>
//             </CardHeader>
//             <CardFooter className='flex-col items-start gap-1.5 text-sm'>
//               <Link href='/dashboard/engagements'>
//                 <Button size='sm' variant='outline'>View Engagements</Button>
//               </Link>
//               <div className='text-muted-foreground'>
//                 Track and manage your current projects
//               </div>
//             </CardFooter>
//           </Card>
//           {/* Messaging & Meetings */}
//           <Card className='@container/card'>
//             <CardHeader>
//               <CardDescription>Messaging & Meetings</CardDescription>
//               <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
//                 <span role='img' aria-label='calendar'>💬</span>
//               </CardTitle>
//               <CardAction>
//                 <Badge variant='outline'>
//                   <IconTrendingUp />
//                   Messages
//                 </Badge>
//               </CardAction>
//             </CardHeader>
//             <CardFooter className='flex-col items-start gap-1.5 text-sm'>
//               <Link href='/dashboard/connect'>
//                 <Button size='sm' variant='outline'>Open Messaging</Button>
//               </Link>
//               <div className='text-muted-foreground'>
//                 Communicate and schedule meetings with clients
//               </div>
//             </CardFooter>
//           </Card>
//           {/* Profile & Compliance Settings */}
//           <Card className='@container/card'>
//             <CardHeader>
//               <CardDescription>Profile & Compliance Settings</CardDescription>
//               <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
//                 <span role='img' aria-label='profile'>🛡️</span>
//               </CardTitle>
//               <CardAction>
//                 <Badge variant='outline'>
//                   <IconTrendingUp />
//                   Compliance
//                 </Badge>
//               </CardAction>
//             </CardHeader>
//             <CardFooter className='flex-col items-start gap-1.5 text-sm'>
//               <Link href='/dashboard/profile'>
//                 <Button size='sm' variant='outline'>Edit Profile</Button>
//               </Link>
//               <div className='text-muted-foreground'>
//                 Manage your firm details, team, and compliance
//               </div>
//             </CardFooter>
//           </Card>
//         </div>

//         {/* QUICK ACTIONS */}
//         <div className='my-10'>
//           <h3 className='font-semibold'>QUICK ACTIONS</h3>
//           <div className='my-5 flex w-full flex-col items-center justify-center gap-10 px-5 md:flex-row md:justify-around md:overflow-x-auto md:px-0 md:whitespace-nowrap'>
//             <Button asChild variant='secondary' className='w-full px-8 whitespace-nowrap hover:border-2 hover:shadow sm:w-3/4 md:w-auto'>
//               <Link href='/dashboard/engagements'>Submit Proposal</Link>
//             </Button>
//             <Button asChild variant='secondary' className='w-full px-8 whitespace-nowrap hover:border-2 hover:shadow sm:w-3/4 md:w-auto'>
//               <Link href='/dashboard/engagements'>View Engagements</Link>
//             </Button>
//             <Button asChild variant='secondary' className='w-full px-8 whitespace-nowrap hover:border-2 hover:shadow sm:w-3/4 md:w-auto'>
//               <Link href='/dashboard/connect'>Open Messaging</Link>
//             </Button>
//             <Button asChild variant='secondary' className='w-full px-8 whitespace-nowrap hover:border-2 hover:shadow sm:w-3/4 md:w-auto'>
//               <Link href='/dashboard/profile'>Edit Profile</Link>
//             </Button>
//           </div>
//         </div>

//         {/* CHARTS BELOW */}
//         <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7'>
//           <div className='col-span-4'>{bar_stats}</div>
//           <div className='col-span-4 md:col-span-3'>
//             {/* sales arallel routes */}
//             {sales}
//           </div>
//           <div className='col-span-4'>{area_stats}</div>
//           <div className='col-span-4 md:col-span-3'>{pie_stats}</div>
//         </div>
//       </div>
//     </PageContainer>
//   );
// }







// #############################################################################################################








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
  const { user } = useAuth();
  const profile = useProfileStore.getState().profile;

  
  console.log(profile)
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-4 pb-10'>
        {/* Main Heading & Welcome Message */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2'>
          <div>
            <h2 className='text-3xl font-extrabold tracking-tight'>
              Auditor Dashboard
            </h2>
            <p className='text-muted-foreground'>
              Welcome back, {user?.displayName || 'Auditor'}. Here's your overview.
            </p>
          </div>
        </div>

        {/* Summary Cards for Main Sections (as per Spec) */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {/* 1. Engagement Requests (Bids Center) */}
          <Card>
            <CardHeader>
              <CardDescription>Engagement Requests</CardDescription>
              <CardTitle className='text-3xl font-semibold'>
                70+
              </CardTitle>
              <CardAction>
                <IconBriefcase className='text-muted-foreground' />
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-2'>
              <Link href='/dashboard/request'>
                <Button size='sm'>View Bids Center</Button>
              </Link>
              <p className='text-sm text-muted-foreground'>
                Find and bid on new audit & tax opportunities.
              </p>
            </CardFooter>
          </Card>

          {/* 2. Active Engagements */}
          <Card>
            <CardHeader>
              <CardDescription>Active Engagements</CardDescription>
              <CardTitle className='text-3xl font-semibold'>
                12
              </CardTitle>
              <CardAction>
                 <IconClipboardList className='text-muted-foreground' />
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-2'>
              <Link href='/dashboard/engagements'>
                <Button size='sm'>Manage Engagements</Button>
              </Link>
              <p className='text-sm text-muted-foreground'>
                Access workspaces for all your ongoing projects.
              </p>
            </CardFooter>
          </Card>

          {/* 3. Messaging & Meetings */}
          <Card>
            <CardHeader>
              <CardDescription>Messaging & Meetings</CardDescription>
              <CardTitle className='text-3xl font-semibold'>
                5 Unread
              </CardTitle>
              <CardAction>
                <IconMessageCircle className='text-muted-foreground' />
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-2'>
              <Link href='/dashboard/connect'>
                <Button size='sm'>Open Inbox</Button>
              </Link>
              <p className='text-sm text-muted-foreground'>
                Communicate with clients and schedule calls.
              </p>
            </CardFooter>
          </Card>

          {/* 4. Profile & Compliance Settings */}
          <Card>
            <CardHeader>
              <CardDescription>Profile & Compliance</CardDescription>
              <CardTitle className='text-2xl font-semibold flex items-center gap-2'>
                Verified <Badge variant="secondary">OK</Badge>
              </CardTitle>
              <CardAction>
                <IconUserCheck className='text-muted-foreground' />
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-2'>
              <Link href='/dashboard/profile'>
                <Button size='sm'>Update Profile</Button>
              </Link>
              <p className='text-sm text-muted-foreground'>
                Manage your firm's details and compliance documents.
              </p>
            </CardFooter>
          </Card>
        </div>

        {/* QUICK ACTIONS */}
        <div className='pt-6 pb-2'>
          <h3 className='text-xl font-semibold tracking-tight mb-4'>Quick Actions</h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Button asChild variant='outline' className='w-full'>
              <Link href='/dashboard/request'>Find New Engagements</Link>
            </Button>
            <Button asChild variant='outline' className='w-full'>
              <Link href='/dashboard/engagements'>Manage Active Engagements</Link>
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
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-7 pt-4'>
          {/* Example: Bar chart for proposals submitted vs won */}
          <div className='lg:col-span-4'>{bar_stats}</div>
          {/* Example: List of recent activities or deadlines */}
          <div className='lg:col-span-3'>
            {sales}
          </div>
          {/* Example: Area chart for revenue over time */}
          <div className='lg:col-span-4'>{area_stats}</div>
          {/* Example: Pie chart for engagement type (Audit vs. Tax) */}
          <div className='lg:col-span-3'>{pie_stats}</div>
        </div>
      </div>
    </PageContainer>
  );
}
