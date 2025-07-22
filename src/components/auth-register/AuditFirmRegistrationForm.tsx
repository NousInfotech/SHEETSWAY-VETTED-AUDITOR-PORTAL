'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { format } from 'date-fns';
import {
  FullFirmRegistrationSchema,
  Country,
  FirmSize,
  Currency
} from '@/lib/validators/firm-registration-schema';

import { useAuth } from '@/components/layout/providers';
import { MultiSelectCreatable } from '@/components/ui/multi-select-creatable';

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
  X,
  Loader2,
  PlusCircle,
  Trash2,
  FileUp,
  Check,
  ChevronsUpDown,
  FileText,
  CalendarIcon
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';
import { useState, ChangeEvent, useEffect } from 'react';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';


type FormValues = z.infer<typeof FullFirmRegistrationSchema>;

const PREDEFINED_SPECIALTIES = [
  'IFRS',
  'Tax Compliance',
  'Forensic Accounting',
  'Smart Contract Audit',
  'DeFi Protocols',
  'NFT Security',
  'L2 Scaling Solutions'
];
const PREDEFINED_LANGUAGES = [
  'English',
  'Arabic',
  'German',
  'Spanish',
  'Japanese',
  'Mandarin',
  'French'
];

const defaultValues: Partial<FormValues> = {
  firmName: '',
  firmLicenseNumber: '',
  registeredIn: undefined,
  registeredOn: undefined,
  firmSize: undefined,
  payoutCurrency: null,
  operatingCountries: [],
  firmLanguages: [],
  firmSpecialties: [],
  portfolioLinks: [],
  email: '',
  password: '',
  confirmPassword: '',
  adminName: '',
  adminLicenseNumber: '',
  adminYearsExperience: 0,
  adminLanguages: [],
  adminSpecialties: []
};

export function AuditFirmRegistrationForm() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const firebaseUser = useAuthStore((state) => state.firebaseUser);

  const form = useForm<FormValues>({
    resolver: zodResolver(FullFirmRegistrationSchema),
    defaultValues,
    mode: 'onChange'
  });

  useEffect(() => {
    if (user) {
      form.setValue('email', user.email || '');
      form.setValue('adminName', user.displayName || '');
    }
  }, [user, form]);

  const {
    fields: portfolioFields,
    append: appendPortfolio,
    remove: removePortfolio
  } = useFieldArray({ name: 'portfolioLinks', control: form.control });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileToRemove)
    );
  };

  async function onSubmit(data: FormValues) {
    if (!user) {
      toast.error('Authentication error', {
        description: 'You must be logged in to register.'
      });
      return;
    }

    setIsSubmitting(true);
    const uploadFiles = async (files: File[]): Promise<string[]> => {
      if (files.length === 0) return [];
      const uploadPromises = files.map(
        (file) =>
          new Promise<string>((resolve) =>
            setTimeout(
              () => resolve(`https://fake-storage.com/docs/${file.name}`),
              500
            )
          )
      );
      toast.promise(Promise.all(uploadPromises), {
        loading: `Uploading ${files.length} file(s)...`,
        success: 'Files uploaded successfully!',
        error: 'File upload failed.'
      });
      return await Promise.all(uploadPromises);
    };

    try {
      const supportingDocUrls = await uploadFiles(selectedFiles);
      const idToken = await user.getIdToken();

      const requestBody = {
        firmData: {
          name: data.firmName,
          licenseNumber: data.firmLicenseNumber,
          registeredIn: data.registeredIn,
          registeredOn: data.registeredOn,
          operatingCountries: data.operatingCountries,
          firmSize: data.firmSize,
          languages: data.firmLanguages || [],
          specialties: data.firmSpecialties || [],
          payoutCurrency: data.payoutCurrency || undefined,
          portfolioLinks: data.portfolioLinks?.map((link) => link.value) || [],
          supportingDocs: supportingDocUrls
        },
        auth: {
          firebaseId: user.uid,
          email: user.email!
        },
        auditor: {
          name: data.adminName,
          licenseNumber: data.adminLicenseNumber,
          yearsExperience: data.adminYearsExperience,
          specialties: data.adminSpecialties || [],
          languages: data.adminLanguages || [],
          payoutCurrency: data.payoutCurrency || undefined,
          accountStatus: 'VERIFIED',
          role: 'SUPERADMIN'
        }
      };

      console.log('Submitting to API:', JSON.stringify(requestBody, null, 2));
      const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!SERVER_URL) {
        throw new Error('Server URL is not configured.');
      }

      const apiEndpoint = `${SERVER_URL}/api/v1/auditors/audit-firm-admin`;

      const response = await axios.post(apiEndpoint, requestBody, {
        headers: { Authorization: `Bearer ${idToken}` }
      });

      toast.success('Firm Registration Successful! 🚀');
      form.reset();
      setSelectedFiles([]);
      setTimeout(() => {
        router.push('/dashboard/overview');
      }, 1000);
    } catch (error) {
      console.error('Registration failed:', error);
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(error) && error.response) {
        console.error('Full Backend Error Response:', error.response.data);
        const responseData = error.response.data;
        if (responseData && responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData && responseData.errors) {
          const zodErrors = responseData.errors;
          const findFirstError = (errs: any): string | null => {
            if (!errs) return null;
            if (errs._errors && errs._errors.length > 0) return errs._errors[0];
            for (const key in errs) {
              if (key !== '_errors') {
                const nestedError = findFirstError(errs[key]);
                if (nestedError) return `${key}: ${nestedError}`;
              }
            }
            return null;
          };
          errorMessage =
            findFirstError(zodErrors) || 'Validation failed. Check console.';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error('Registration Failed', { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <>
      <Card className='mx-auto my-8 w-full max-w-4xl shadow-lg'>
        <CardHeader>
          <CardTitle className='text-3xl font-bold tracking-tight'>
            Audit Firm Registration
          </CardTitle>
          <CardDescription>
            Establish your firm and create your superadmin account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-12'>
              <div className='space-y-6'>
                <h3 className='border-b pb-2 text-xl font-semibold tracking-tight'>
                  Firm Information
                </h3>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='firmName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Firm Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g., SecureChain Labs'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='firmLicenseNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business License Number</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g., 123-456-789' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='registeredOn'
                    render={({ field }) => (
                      <FormItem className='flex flex-col'>
                        <FormLabel>Date Registered</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='registeredIn'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country of Registration</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select a country' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(Country).map((c) => (
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
                  <FormField
                    control={form.control}
                    name='firmSize'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Firm Size</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select firm size' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(FirmSize).map(([key, val]) => (
                              <SelectItem key={key} value={val}>
                                {val}
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
                  <FormField
                    control={form.control}
                    name='operatingCountries'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operating Countries</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='combobox'
                                className={cn(
                                  'h-auto min-h-10 w-full justify-between',
                                  !field.value?.length &&
                                    'text-muted-foreground'
                                )}
                              >
                                <div className='flex flex-wrap gap-1'>
                                  {field.value && field.value.length > 0
                                    ? field.value.map((c) => (
                                        <Badge key={c} variant='secondary'>
                                          {c}
                                        </Badge>
                                      ))
                                    : 'Select countries...'}
                                </div>
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className='w-[--radix-popover-trigger-width] p-0'
                            align='start'
                          >
                            <Command>
                              <CommandInput placeholder='Search country...' />
                              <CommandList>
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                  {Object.values(Country).map((country) => (
                                    <CommandItem
                                      key={country}
                                      value={country}
                                      onSelect={() => {
                                        const current = field.value || [];
                                        const isSelected =
                                          current.includes(country);
                                        const newValue = isSelected
                                          ? current.filter((c) => c !== country)
                                          : [...current, country];
                                        field.onChange(newValue);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value?.includes(country)
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {country}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='firmSpecialties'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Firm Specialties</FormLabel>
                        <FormControl>
                          <MultiSelectCreatable
                            options={PREDEFINED_SPECIALTIES}
                            value={field.value ?? []}
                            onChange={field.onChange}
                            placeholder='Select or create specialties...'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='firmLanguages'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Firm Languages</FormLabel>
                        <FormControl>
                          <MultiSelectCreatable
                            options={PREDEFINED_LANGUAGES}
                            value={field.value ?? []}
                            onChange={field.onChange}
                            placeholder='Select or create languages...'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className='space-y-6'>
                <h3 className='border-b pb-2 text-xl font-semibold tracking-tight'>
                  Auditor Registration
                </h3>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='adminName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder='Jane Doe' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='adminLicenseNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Auditor License</FormLabel>
                        <FormControl>
                          <Input placeholder='AUD-2024-XYZ' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='adminYearsExperience'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Years of Experience</FormLabel>
                        <FormControl>
                          <Input type='number' placeholder='15' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login Email</FormLabel>
                        <FormControl>
                          <Input
                            type='email'
                            {...field}
                            // readOnly
                            className='bg-muted cursor-default focus-visible:ring-0 focus-visible:ring-offset-0'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    control={form.control}
                    name='adminSpecialties'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Specialties</FormLabel>
                        <FormControl>
                          <MultiSelectCreatable
                            options={PREDEFINED_SPECIALTIES}
                            value={field.value ?? []}
                            onChange={field.onChange}
                            placeholder='Select or create specialties...'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='adminLanguages'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Languages</FormLabel>
                        <FormControl>
                          <MultiSelectCreatable
                            options={PREDEFINED_LANGUAGES}
                            value={field.value ?? []}
                            onChange={field.onChange}
                            placeholder='Select or create languages...'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className='space-y-6'>
                <h3 className='border-b pb-2 text-xl font-semibold tracking-tight'>
                  Documents & Portfolio
                </h3>
                <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                  <div>
                    <FormLabel>Portfolio Links</FormLabel>
                    <FormDescription className='text-xs'>
                      Links to public audit reports or the firm's website.
                    </FormDescription>
                    <div className='mt-2 space-y-2'>
                      {portfolioFields.map((field, index) => (
                        <FormField
                          control={form.control}
                          key={field.id}
                          name={`portfolioLinks.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className='flex items-center gap-2'>
                                  <Input
                                    {...field}
                                    placeholder='https://my-firm.com/audits'
                                  />
                                  <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    onClick={() => removePortfolio(index)}
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
                      onClick={() => appendPortfolio({ value: '' })}
                    >
                      <PlusCircle className='mr-2 h-4 w-4' />
                      Add Link
                    </Button>
                  </div>
                  <div className='space-y-2'>
                    <FormLabel>Supporting Documents</FormLabel>
                    <FormDescription className='text-xs'>
                      Upload business registration, certifications, etc. (PDF
                      only)
                    </FormDescription>
                    <div className='relative'>
                      <label
                        htmlFor='file-upload-firm'
                        className='text-primary hover:text-primary-focus relative cursor-pointer rounded-md font-medium'
                      >
                        <div className='border-muted hover:border-primary flex items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors'>
                          <div className='text-center'>
                            <FileUp className='text-muted-foreground mx-auto h-12 w-12' />
                            <p className='text-muted-foreground mt-2 text-sm'>
                              <span className='text-primary font-semibold'>
                                Click to upload
                              </span>{' '}
                              or drag and drop
                            </p>
                          </div>
                        </div>
                      </label>
                      <Input
                        id='file-upload-firm'
                        type='file'
                        className='sr-only'
                        multiple
                        accept='.pdf'
                        onChange={handleFileChange}
                      />
                    </div>
                    {selectedFiles.length > 0 && (
                      <div className='space-y-2 pt-2'>
                        <h4 className='text-sm font-medium'>Selected files:</h4>
                        <div className='space-y-2 rounded-md border p-2'>
                          {selectedFiles.map((file, index) => (
                            <div
                              key={index}
                              className='flex items-center justify-between text-sm'
                            >
                              <div className='flex items-center gap-2 truncate'>
                                <FileText className='h-4 w-4 flex-shrink-0' />
                                <span className='truncate'>{file.name}</span>
                                <span className='text-muted-foreground text-xs'>
                                  ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <Button
                                type='button'
                                variant='ghost'
                                size='icon'
                                className='h-6 w-6'
                                onClick={() => removeFile(file)}
                              >
                                <X className='text-destructive h-4 w-4' />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type='submit'
                className='w-full md:w-auto'
                disabled={isSubmitting || authLoading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Submitting...
                  </>
                ) : (
                  'Create Firm and Register'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
