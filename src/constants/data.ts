import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Engagement Requests',
    url: '/dashboard/request',
    icon: 'request',
    isActive: false,
    shortcut: ['r', 'r'],
    items: []
  },
  {
    title: 'Active Engagements',
    url: '/dashboard/engagements',
    icon: 'engagements',
    isActive: false,
    shortcut: ['e', 'e'],
    items: []
  },
  {
    title: 'Messaging & Meetings',
    url: '/dashboard/connect',
    icon: 'connect',
    shortcut: ['c', 'c'],
    isActive: false,
    items: []
  },
  {
    title: 'Profile & Compliance',
    url: '/dashboard/profile',
    icon: 'user',
    isActive: false,
    shortcut: ['p', 'c'],
    items: []
  },
  {
    title: 'Proposals',
    url: '/dashboard/proposals',
    icon: 'proposals',
    isActive: false,
    shortcut: ['p', 'p'],
    items: []
  },
  {
    title: 'Payments',
    url: '/dashboard/payments',
    icon: 'payments',
    isActive: false,
    shortcut: ['y', 'y'],
    items: []
  },
  {
    title: 'History',
    url: '/dashboard/history',
    icon: 'history',
    isActive: false,
    shortcut: ['h', 'h'],
    items: []
  }
];


export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
