'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { format } from 'date-fns';
import {
  ProposalFormSchema,
  Currency
} from '@/lib/validators/proposal-form-schema';

import { useAuth } from '@/components/layout/providers';
import { useRouter } from 'next/navigation';

import { createProposal } from '@/lib/services/proposalService';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { X, Loader2, PlusCircle, Trash2, CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useProfileStore } from '@/stores/useProfileStore';

type FormValues = z.infer<typeof ProposalFormSchema>;

interface CreateProposalFormProps {
  clientRequestId: string;
  auditorId: string;
  auditFirmId: string;
}

const currencySymbols: Record<Currency, string> = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
  [Currency.INR]: '₹',
  [Currency.AED]: 'DH',
  [Currency.OTHER]: ''
};

const defaultValues: Partial<FormValues> = {
  proposalName: '',
  description: '',
  quotation: '' as any,
  currency: Currency.USD,
  estimatedDuration: '' as any,
  requestNote: '',
  dateRange: { from: undefined, to: undefined },
  terms: [],
  deliverables: []
};

export function CreateProposalForm({
  clientRequestId,
  auditorId,
  auditFirmId
}: CreateProposalFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const profile = useProfileStore.getState().profile;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(ProposalFormSchema),
    defaultValues,
    mode: 'onChange'
  });

  const {
    fields: termsFields,
    append: appendTerm,
    remove: removeTerm
  } = useFieldArray({ name: 'terms', control: form.control });
  const {
    fields: deliverablesFields,
    append: appendDeliverable,
    remove: removeDeliverable
  } = useFieldArray({ name: 'deliverables', control: form.control });

  const selectedCurrency = form.watch('currency');

  async function onSubmit(data: FormValues) {
    if (!user) {
      toast.error('Authentication Error', {
        description: 'You must be logged in to submit a proposal.'
      });
      return;
    }
    setIsSubmitting(true);

    try {
      
      const requestBody = {
        clientRequestId,
        auditorId: profile?.id,
        auditFirmId: profile?.auditFirmId,
        proposalName: data.proposalName,
        description: data.description,
        quotation: Math.round(data.quotation * 100),
        currency: data.currency,
        estimatedDuration: data.estimatedDuration,
        startDate: data.dateRange.from!,
        endDate: data.dateRange.to!,
        requestNote: data.requestNote,
        terms: data.terms?.map((t) => t.value).filter(Boolean) || [],
        deliverables:
          data.deliverables?.map((d) => d.value).filter(Boolean) || [],
        
        status: 'PENDING' as const 
      };

      await createProposal(requestBody);
      console.log(requestBody)

      toast.success('Proposal Submitted Successfully! 🚀');

      setTimeout(() => {
        router.push('/dashboard/my-proposals');
      }, 1500);
    } catch (error) {
      console.error('Proposal submission failed:', error);
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error('Submission Failed', { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }
  console.log(profile)
  return (
    <Card className='mx-auto my-8 w-full max-w-4xl shadow-lg'>
      <CardHeader>
        <CardTitle className='text-3xl font-bold tracking-tight'>
          Create a New Proposal
        </CardTitle>
        <CardDescription>
          Fill out the details below to respond to the client's request.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-12'>
            {/* Section 1: Core Details */}
            <div className='space-y-6'>
              <h3 className='border-b pb-2 text-xl font-semibold tracking-tight'>
                Core Details
              </h3>
              <FormField
                control={form.control}
                name='proposalName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proposal Name / Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g., Financial Audit for Q1 2024'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe the scope of work, methodology, and what is included...'
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Updated requestNote to reflect that it's required */}
              <FormField
                control={form.control}
                name='requestNote'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note to Client</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Add a personal note or highlight key aspects of your proposal...'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section 2: Timeline & Financials */}
            <div className='space-y-6'>
              <h3 className='border-b pb-2 text-xl font-semibold tracking-tight'>
                Timeline & Financials
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='dateRange'
                  render={({ field }) => (
                    <FormItem className='flex flex-col'>
                      <FormLabel>Proposed Start & End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'pl-3 text-left font-normal',
                                !field.value?.from && 'text-muted-foreground'
                              )}
                            >
                              {field.value?.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, 'LLL dd, y')} -{' '}
                                    {format(field.value.to, 'LLL dd, y')}
                                  </>
                                ) : (
                                  format(field.value.from, 'LLL dd, y')
                                )
                              ) : (
                                <span>Pick a date range</span>
                              )}
                              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='range'
                            selected={{
                              from: field.value?.from,
                              to: field.value?.to
                            }}
                            onSelect={field.onChange}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='estimatedDuration'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Duration (in days)</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='e.g., 30'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid grid-cols-3 gap-2'>
                  <FormField
                    control={form.control}
                    name='quotation'
                    render={({ field }) => (
                      <FormItem className='col-span-2'>
                        <FormLabel>Quotation</FormLabel>
                        <div className='relative'>
                          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                            <span className='text-muted-foreground sm:text-sm'>
                              {currencySymbols[selectedCurrency]}
                            </span>
                          </div>
                          <FormControl>
                            <Input
                              type='number'
                              step='0.01'
                              placeholder='10,000'
                              className='pl-7'
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='currency'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(Currency).map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Terms & Deliverables */}
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
              <div className='space-y-4'>
                <h3 className='border-b pb-2 text-xl font-semibold tracking-tight'>
                  Terms
                </h3>
                <div className='space-y-2'>
                  {termsFields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`terms.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className='flex items-center gap-2'>
                              <Input
                                placeholder={`Term ${index + 1}`}
                                {...field}
                              />
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                onClick={() => removeTerm(index)}
                              >
                                <Trash2 className='text-destructive h-4 w-4' />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => appendTerm({ value: '' })}
                >
                  <PlusCircle className='mr-2 h-4 w-4' />
                  Add Term
                </Button>
              </div>
              <div className='space-y-4'>
                <h3 className='border-b pb-2 text-xl font-semibold tracking-tight'>
                  Deliverables
                </h3>
                <div className='space-y-2'>
                  {deliverablesFields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`deliverables.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className='flex items-center gap-2'>
                              <Input
                                placeholder={`Deliverable ${index + 1}`}
                                {...field}
                              />
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                onClick={() => removeDeliverable(index)}
                              >
                                <Trash2 className='text-destructive h-4 w-4' />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => appendDeliverable({ value: '' })}
                >
                  <PlusCircle className='mr-2 h-4 w-4' />
                  Add Deliverable
                </Button>
              </div>
            </div>

            <Button
              type='submit'
              className='w-full md:w-auto'
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Submitting Proposal...
                </>
              ) : (
                'Submit Proposal'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
