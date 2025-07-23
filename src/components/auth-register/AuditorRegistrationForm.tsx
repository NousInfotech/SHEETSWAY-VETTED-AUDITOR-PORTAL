'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import {
  AuditorFormSchema,
  AuditorRole,
  Currency,
  AccountStatus
} from '@/lib/validators/auditor-schema';
import { AuditorProfile } from '@/stores/useProfileStore';

import { toast } from 'sonner';
import axios from 'axios';
import {
  createAuditor,
  updateAuditor,
  UpdateAuditorPayload,
  CreateAuditorPayload
} from '@/lib/services/auditorService';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { MultiSelectCreatable } from '@/components/ui/multi-select-creatable';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';



type FormValues = z.infer<typeof AuditorFormSchema>;

interface AuditorRegistrationFormProps {
  auditorToEdit?: AuditorProfile | null;
  onFormSubmit?: () => void;
  isModalMode?: boolean;
}

const PREDEFINED_SPECIALTIES = [
  'IFRS',
  'Tax Compliance',
  'Smart Contract Audit'
];
const PREDEFINED_LANGUAGES = ['English', 'Arabic', 'German', 'Spanish'];

export function AuditorRegistrationForm({
  auditorToEdit,
  onFormSubmit,
  isModalMode = false
}: AuditorRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!auditorToEdit;

  const form = useForm<FormValues>({
    resolver: zodResolver(AuditorFormSchema),
    defaultValues: {
      name: '',
      licenseNumber: '',
      role: undefined,
      yearsExperience: 0,
      payoutCurrency: null,
      accountStatus: AccountStatus.PENDING,
      stripeAccountId: '',
      specialties: [],
      languages: [],
      portfolioLinks: [],
      email: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onChange'
  });

  useEffect(() => {
    if (isEditMode && auditorToEdit) {
      form.reset({
        name: auditorToEdit.name,
        licenseNumber: auditorToEdit.licenseNumber,
        role: auditorToEdit.role,
        yearsExperience: auditorToEdit.yearsExperience,
        payoutCurrency: auditorToEdit.payoutCurrency,
        accountStatus: auditorToEdit.accountStatus,
        stripeAccountId: auditorToEdit.stripeAccountId || '',
        specialties: auditorToEdit.specialties,
        languages: auditorToEdit.languages,
        portfolioLinks:
          auditorToEdit.portfolioLinks?.map((link) => ({ value: link })) || []
      });
    }
  }, [auditorToEdit, isEditMode, form, form.reset]);

  const {
    fields: portfolioFields,
    append: appendPortfolioLink,
    remove: removePortfolioLink
  } = useFieldArray({
    name: 'portfolioLinks',
    control: form.control
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    try {
      if (isEditMode && auditorToEdit) {
        const payload: UpdateAuditorPayload = {
          name: data.name,
          licenseNumber: data.licenseNumber,
          yearsExperience: data.yearsExperience,
          role: data.role,
          accountStatus: data.accountStatus,
          stripeAccountId: data.stripeAccountId,
          specialties: data.specialties,
          languages: data.languages,
          payoutCurrency: data.payoutCurrency,
          portfolioLinks: data.portfolioLinks
            ?.map((link) => link.value)
            .filter(Boolean)
        };
        await updateAuditor(auditorToEdit.id, payload);
        toast.success('Profile updated successfully!');
      } else {
        if (data.password !== data.confirmPassword) {
          toast.error('Passwords do not match');
          return;
        } else if (!data.email || !data.password || !data.role) {
          throw new Error(
            'Email, password, and role are required to create a new auditor.'
          );
        }

        // Step 1: Create the user in Firebase Auth.
        // const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        // const firebaseUser = userCredential.user;
        // await updateProfile(firebaseUser, { displayName: data.name });
        // console.log("Step 1/2: Firebase user created successfully:", firebaseUser.uid)

        // Step 2: Create backend user record

        try {
          const payload: CreateAuditorPayload = {
            auth: {
              name: data.name,
              email: data.email,
              password: data.password
            },
            auditor: {
              name: data.name,
              licenseNumber: data.licenseNumber,
              role: data.role,
              yearsExperience: data.yearsExperience,
              accountStatus: AccountStatus.PENDING,
              payoutCurrency: data.payoutCurrency,
              specialties: data.specialties,
              languages: data.languages,
              portfolioLinks: data.portfolioLinks
                ?.map((link) => link.value)
                .filter(Boolean),
              stripeAccountId: data.stripeAccountId
            }
          };
          console.log(payload);
          await createAuditor(payload);
          toast.success('Auditor account and profile created successfully!');
        } catch (error) {
          console.error('Backend auditor creation failed');
          throw error;
        }
      }

      if (onFormSubmit) onFormSubmit();
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred.';

      // Axios errors
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message || 'Backend request failed.';
      }
      // Generic errors
      else {
        errorMessage = error.message;
      }

      toast.error('Submission Failed', { description: errorMessage });
      console.error('Detailed error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const cardClasses = isModalMode
    ? 'border-none shadow-none'
    : 'mx-auto my-8 w-full max-w-4xl shadow-lg';

  const InfoField = ({
    label,
    value
  }: {
    label: string;
    value: string | number | null | undefined;
  }) => (
    <div className='space-y-1'>
      <FormLabel>{label}</FormLabel>
      <p className='border-input bg-muted text-muted-foreground flex h-10 w-full items-center truncate rounded-md border px-3 py-2 text-sm'>
        {value || 'N/A'}
      </p>
    </div>
  );

  return (
    <Card className={cn(cardClasses)}>
      {!isEditMode && !isModalMode && (
        <CardHeader>
          <CardTitle className='text-2xl'>Register a New Auditor</CardTitle>
          <CardDescription>
            Create an account and professional profile for a new team member.
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={cn(isModalMode && 'p-1')}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-12'>
            {!isEditMode && (
              <div className='space-y-6'>
                <h3 className='border-b pb-2 text-xl font-semibold'>
                  Account Credentials
                </h3>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            placeholder='auditor@example.com'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='••••••••'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='••••••••'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            <div className='space-y-6'>
              <h3 className='border-b pb-2 text-xl font-semibold'>
                Professional Information
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder='John Doe' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='licenseNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Number</FormLabel>
                      <FormControl>
                        <Input placeholder='CISA-12345' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='yearsExperience'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type='number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a role' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(AuditorRole).map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='payoutCurrency'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payout Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ''}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a currency' />
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

            {/* Admin Controls Section - now with Stripe Account ID */}
            {isEditMode && (
              <div className='space-y-6'>
                <h3 className='border-b pb-2 text-xl font-semibold'>
                  Admin Controls & Status
                </h3>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='accountStatus'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Set account status' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(AccountStatus).map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* --- THIS IS THE MISSING FIELD --- */}
                  <FormField
                    control={form.control}
                    name='stripeAccountId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stripe Account ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='acct_...'
                            {...field}
                            value={field.value ?? ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <InfoField
                    label='Vetted Status'
                    value={auditorToEdit?.vettedStatus}
                  />
                  <InfoField
                    label='Joined On'
                    value={
                      auditorToEdit
                        ? format(new Date(auditorToEdit.createdAt), 'PPP')
                        : null
                    }
                  />
                </div>
              </div>
            )}

            {/* Performance Metrics Section */}
            {isEditMode && (
              <div className='space-y-6'>
                <h3 className='border-b pb-2 text-xl font-semibold'>
                  Performance Metrics (Read-Only)
                </h3>
                <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
                  <InfoField
                    label='Rating'
                    value={auditorToEdit?.rating.toFixed(1)}
                  />
                  <InfoField
                    label='Reviews'
                    value={auditorToEdit?.reviewsCount}
                  />
                  <InfoField
                    label='Successful Audits'
                    value={auditorToEdit?.successCount}
                  />
                  <InfoField
                    label='Avg. Response (hrs)'
                    value={auditorToEdit?.avgResponseTime}
                  />
                </div>
              </div>
            )}

            {/* Skills & Portfolio Section */}
            <div className='space-y-6'>
              <h3 className='border-b pb-2 text-xl font-semibold'>
                Skills & Portfolio
              </h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='specialties'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialties</FormLabel>
                      <FormControl>
                        <MultiSelectCreatable
                          options={PREDEFINED_SPECIALTIES}
                          value={field.value ?? []}
                          onChange={field.onChange}
                          placeholder='Select or create...'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='languages'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages</FormLabel>
                      <FormControl>
                        <MultiSelectCreatable
                          options={PREDEFINED_LANGUAGES}
                          value={field.value ?? []}
                          onChange={field.onChange}
                          placeholder='Select or create...'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='pt-4'>
                <FormLabel>Portfolio Links</FormLabel>
                <div className='mt-2 space-y-2'>
                  {portfolioFields.map((item, index) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={`portfolioLinks.${index}.value`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className='flex items-center gap-2'>
                              <Input
                                {...field}
                                placeholder='https://github.com/johndoe/audits'
                              />
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                onClick={() => removePortfolioLink(index)}
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
                  className='mt-2'
                  onClick={() => appendPortfolioLink({ value: '' })}
                >
                  <PlusCircle className='mr-2 h-4 w-4' />
                  Add Link
                </Button>
              </div>
            </div>

            <Button
              type='submit'
              className='w-full md:w-auto'
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              {isEditMode ? 'Save Changes' : 'Register Auditor'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
