import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

const projectsData = [
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
  }
];

export function RecentSales() {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
        <div className='flex justify-between text-xs font-semibold text-muted-foreground border-b pb-2'>
          <span className='w-1/4'>Project Name</span>
          <span className='w-1/6'>Type</span>
          <span className='w-1/6'>Status</span>
          <span className='w-1/6'>Budget</span>
          <span className='w-1/6'>Deadline</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className='divide-y'>
          {projectsData.map((proj, idx) => (
            <div key={idx} className='flex items-center py-3 text-sm'>
              <span className='w-1/4 font-medium'>{proj.name}</span>
              <span className='w-1/6'>{proj.type}</span>
              <span className='w-1/6'>{proj.status}</span>
              <span className='w-1/6'>{proj.budget}</span>
              <span className='w-1/6'>{proj.deadline}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
