import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import DashboardClientLayout from './DashboardClientLayout';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Sheetsway provides excellent auditing Services'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <DashboardClientLayout defaultOpen={defaultOpen}>
      {children}
    </DashboardClientLayout>
  );
}
