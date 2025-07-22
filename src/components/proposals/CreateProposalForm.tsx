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
import {
  createProposal,
  updateProposal,
  Proposal,
  UpdateProposalPayload,
  CreateProposalPayload
} from '@/lib/services/proposalService';
import { useProfileStore } from '@/stores/useProfileStore';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

type FormValues = z.infer<typeof ProposalFormSchema>;

interface ProposalFormProps {
  proposalToEdit?: Proposal | null;
  clientRequestId?: string;
  auditorId?: string;
  auditFirmId?: string;
  onFormSubmit?: () => void;
  isModalMode?: boolean;
}

const currencySymbols: Record<Currency, string> = {
  [Currency.USD]: '$',
  [Currency.EUR]: '€',
  [Currency.GBP]: '£',
  [Currency.INR]: '₹',
  [Currency.AED]: 'DH',
  [Currency.OTHER]: ''
};

export function CreateProposalForm({
  proposalToEdit,
  clientRequestId,
  auditorId,
  auditFirmId,
  onFormSubmit,
  isModalMode = false
}: ProposalFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const profile = useProfileStore((state) => state.profile);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!proposalToEdit;

  const form = useForm<FormValues>({
    resolver: zodResolver(ProposalFormSchema),
    defaultValues: {
      proposalName: '',
      description: '',
      quotation: '' as any,
      currency: Currency.USD,
      estimatedDuration: '' as any,
      requestNote: '',
      dateRange: { from: undefined, to: undefined },
      terms: [],
      deliverables: []
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (isEditMode && proposalToEdit) {
      form.reset({
        proposalName: proposalToEdit.proposalName,
        description: proposalToEdit.description,
        quotation: proposalToEdit.quotation / 100,
        currency: proposalToEdit.currency,
        estimatedDuration: proposalToEdit.estimatedDuration,
        requestNote: proposalToEdit.requestNote,
        dateRange: {
          from: new Date(proposalToEdit.startDate),
          to: new Date(proposalToEdit.endDate)
        },
        terms: proposalToEdit.terms.map((value) => ({ value })),
        deliverables: proposalToEdit.deliverables.map((value) => ({ value }))
      });
    }
  }, [proposalToEdit, isEditMode, form, form.reset]);

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
    if (!user || !profile) {
      toast.error('Authentication Error', {
        description: 'Your profile is not loaded. Please try again.'
      });
      return;
    }
    setIsSubmitting(true);

    try {
      if (isEditMode && proposalToEdit) {
        const payload: UpdateProposalPayload = {
          proposalName: data.proposalName,
          description: data.description,
          quotation: Math.round(data.quotation * 100),
          currency: data.currency,
          estimatedDuration: data.estimatedDuration,
          startDate: data.dateRange.from!,
          endDate: data.dateRange.to!,
          requestNote: data.requestNote,
          terms: data.terms?.map((t) => t.value).filter(Boolean),
          deliverables: data.deliverables?.map((d) => d.value).filter(Boolean)
        };
        await updateProposal(proposalToEdit.id, payload);
        toast.success('Proposal updated successfully!');
      } else {
        const resolvedAuditorId = auditorId ?? profile.id;
        const resolvedAuditFirmId = auditFirmId ?? profile.auditFirmId;
        if (!clientRequestId || !resolvedAuditorId || !resolvedAuditFirmId) {
          throw new Error(
            'Missing Client Request ID, Auditor ID, or Firm ID. Cannot create proposal.'
          );
        }
        const payload: CreateProposalPayload = {
          clientRequestId,
          auditorId: resolvedAuditorId,
          auditFirmId: resolvedAuditFirmId,
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
            data.deliverables?.map((d) => d.value).filter(Boolean) || []
        };
        await createProposal(payload);
        toast.success('Proposal submitted successfully!');
      }

      if (onFormSubmit) {
        onFormSubmit();
      } else {
        router.push('/dashboard/my-proposals');
      }
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

  const cardClasses = isModalMode
    ? 'border-none shadow-none'
    : 'mx-auto my-8 w-full max-w-4xl shadow-lg';

  return (
    <Card className={cn(cardClasses)}>
      {!isModalMode && (
        <CardHeader>
          <CardTitle className='text-3xl font-bold tracking-tight'>
            {isEditMode ? 'Edit Proposal' : 'Create a New Proposal'}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? 'Update the details of your proposal below.'
              : "Fill out the details below to respond to the client's request."}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={cn(isModalMode && 'p-1', !isModalMode && 'pt-6')}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-12'>
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
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />{' '}
                  Submitting...
                </>
              ) : isEditMode ? (
                'Save Changes'
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
