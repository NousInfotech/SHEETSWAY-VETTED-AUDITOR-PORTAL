'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  IconChevronRight,
  IconFileSearch,
  IconCalculator,
  IconCalendarEvent
} from '@tabler/icons-react';

// Define a type for our project data for better type safety
type Project = {
  name: string;
  type: 'Audit' | 'Tax';
  status: 'In Progress' | 'Planning' | 'Under Review';
  budget: string;
  deadline: string;
};

// The same data you provided
const projectsData: Project[] = [
  {
    name: 'Acme Corp Q2 Audit',
    type: 'Audit',
    status: 'In Progress',
    budget: '€5,000',
    deadline: '2024-07-15'
  },
  {
    name: 'Beta Ltd Tax Filing',
    type: 'Tax',
    status: 'Planning',
    budget: '€2,500',
    deadline: '2024-07-30'
  },
  {
    name: 'Gamma Inc Annual Audit',
    type: 'Audit',
    status: 'Under Review',
    budget: '€7,200',
    deadline: '2024-08-10'
  },
  {
    name: 'Delta LLC VAT Return',
    type: 'Tax',
    status: 'In Progress',
    budget: '€1,800',
    deadline: '2024-07-20'
  },
  {
    name: 'Epsilon GmbH Compliance',
    type: 'Audit',
    status: 'Planning',
    budget: '€3,400',
    deadline: '2024-08-01'
  },
  {
    name: 'Zenith Logistics',
    type: 'Tax',
    status: 'Planning',
    budget: '€3,800',
    deadline: '2024-08-25'
  }
];

// Reusable helper functions for styling
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'In Progress':
      return {
        variant: 'default' as const,
        className:
          'bg-blue-500/20 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/30'
      };
    case 'Planning':
      return { variant: 'secondary' as const, className: '' };
    case 'Under Review':
      return {
        variant: 'default' as const,
        className:
          'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30'
      };
    default:
      return { variant: 'outline' as const, className: '' };
  }
};

export function RecentSales() {
  // State to manage which project is selected to be shown in the modal
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleRowClick = (project: Project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <>
      <Card className='h-full'>
        <CardHeader>
          <div>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              An overview of your current engagements.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className='pt-6'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead className='hidden sm:table-cell'>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='hidden text-right md:table-cell'>
                  Budget
                </TableHead>
                <TableHead className='text-right'>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectsData.map((project) => (
                <TableRow key={project.name} className='group'>
                  <TableCell className='font-medium'>{project.name}</TableCell>
                  <TableCell className='hidden sm:table-cell'>
                    {project.type}
                  </TableCell>
                  <TableCell>
                    <Badge {...getStatusBadge(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className='hidden text-right md:table-cell'>
                    {project.budget}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='group-hover:bg-muted rounded-full'
                      onClick={() => handleRowClick(project)}
                    >
                      <IconChevronRight className='h-5 w-5' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* The Modal Dialog */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={(isOpen) => !isOpen && closeModal()}
      >
        <DialogContent className='sm:max-w-[425px]'>
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className='flex items-center gap-2'>
                  {selectedProject.type === 'Audit' ? (
                    <IconFileSearch />
                  ) : (
                    <IconCalculator />
                  )}
                  {selectedProject.name}
                </DialogTitle>
                <DialogDescription>
                  Detailed overview of the engagement.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Status</span>
                  <Badge {...getStatusBadge(selectedProject.status)}>
                    {selectedProject.status}
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Budget</span>
                  <span className='font-semibold'>
                    {selectedProject.budget}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground flex items-center gap-2'>
                    <IconCalendarEvent size={16} /> Deadline
                  </span>
                  <span className='font-semibold'>
                    {selectedProject.deadline}
                  </span>
                </div>
              </div>
              <Button onClick={() => alert('Entering workspace...')}>
                Enter Workspace
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
