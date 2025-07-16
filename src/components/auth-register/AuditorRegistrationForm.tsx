"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  SoloAuditorRegistrationSchema,
  AuditorRole,
  Currency,
  AccountStatus,
} from "@/lib/validators/auditor-schema";

import { MultiSelectCreatable } from "@/components/ui/multi-select-creatable";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Loader2,
  PlusCircle,
  Trash2,
  FileUp,
  FileText
} from "lucide-react";
import { useState, ChangeEvent } from "react";
import { toast } from "sonner";

type FormValues = z.infer<typeof SoloAuditorRegistrationSchema>;

const PREDEFINED_SPECIALTIES = [
  'IFRS', 'Tax Compliance', 'Forensic Accounting', 'Smart Contract Audit', 'DeFi Protocols', 'NFT Security', 'L2 Scaling Solutions'
];
const PREDEFINED_LANGUAGES = [
  'English', 'Arabic', 'German', 'Spanish', 'Japanese', 'Mandarin', 'French'
];

const defaultValues: Partial<FormValues> = {
  name: '',
  licenseNumber: '',
  role: undefined,
  yearsExperience: 0,
  payoutCurrency: null,
  specialties: [],
  languages: [],
  portfolioLinks: [],
  email: '',
  password: '',
  confirmPassword: '',
};


interface AuditorRegistrationFormProps {
  onFormSubmit?: () => void; 
}

export function AuditorRegistrationForm({ onFormSubmit }: AuditorRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(SoloAuditorRegistrationSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields: portfolioFields, append: appendPortfolio, remove: removePortfolio } = useFieldArray({
    name: "portfolioLinks",
    control: form.control,
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setSelectedFiles((prevFiles) => prevFiles.filter(file => file !== fileToRemove));
  };

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);

    const uploadFiles = async (files: File[]): Promise<string[]> => {
      if (files.length === 0) return [];
      const uploadPromises = files.map((file) => new Promise<string>((resolve) =>
        setTimeout(() => resolve(`https://fake-storage.com/docs/${file.name}`), 500)
      ));
      toast.promise(Promise.all(uploadPromises), {
        loading: `Uploading ${files.length} file(s)...`,
        success: 'Files uploaded successfully!',
        error: 'File upload failed.'
      });
      return await Promise.all(uploadPromises);
    };

    try {
      const supportingDocUrls = await uploadFiles(selectedFiles);
      
      const requestBody = {
        auth: {
          firebaseId: 'firebase-uid-placeholder',
          email: data.email,
        },
        auditor: {
          name: data.name,
          licenseNumber: data.licenseNumber,
          role: data.role,
          yearsExperience: data.yearsExperience,
          specialties: data.specialties || [],
          languages: data.languages || [],
          payoutCurrency: data.payoutCurrency || undefined,
          portfolioLinks: data.portfolioLinks?.map((link) => link.value) || [],
          supportingDocs: supportingDocUrls,
          // Add the required accountStatus field
          accountStatus: AccountStatus.PENDING,
        }
      };

      console.log('Submitting to API:', JSON.stringify(requestBody, null, 2));
      const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL; 
      if (!SERVER_URL) {
        throw new Error('Server URL is not configured.');
      }

      // The endpoint 
      const apiEndpoint = `${SERVER_URL}/api/v1/auditors`; 
      const response = await axios.post(apiEndpoint, requestBody);

      toast.success('Registration Successful! 🚀', {
        description: "Your profile is under review. We'll be in touch!",
      });
      toast.success('Registration Successful! 🚀', {
        description: "The new auditor has been added to the team.",
      });
      form.reset();
      setSelectedFiles([]);

      if (onFormSubmit) {
        onFormSubmit();
      }
      
    } catch (error) {
      console.error('Registration failed:', error);
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(error) && error.response) {
        console.error('Full Backend Error Response:', error.response.data);
        const responseData = error.response.data;
        if (responseData && responseData.errors) {
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
            }
            errorMessage = findFirstError(zodErrors) || responseData.message || 'Validation failed.';
        } else {
             errorMessage = responseData.message || 'Server error.';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error('Registration Failed', { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto my-8 w-full max-w-4xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold tracking-tight">Auditor Registration</CardTitle>
        <CardDescription>Join our platform by creating your account and professional profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            
            {/* Section 1: Account Information */}
            <div className='space-y-6'>
              <h3 className='border-b pb-2 text-xl font-semibold tracking-tight'>Account Information</h3>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField control={form.control} name='email' render={({ field }) => (<FormItem><FormLabel>Login Email</FormLabel><FormControl><Input type='email' placeholder='you@example.com' {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <div/>
                <FormField control={form.control} name='password' render={({ field }) => (<FormItem><FormLabel>Password</FormLabel><FormControl><Input type='password' placeholder='••••••••' {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name='confirmPassword' render={({ field }) => (<FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type='password' placeholder='••••••••' {...field} /></FormControl><FormMessage /></FormItem>)}/>
              </div>
            </div>

            {/* Section 2: Professional Information */}
            <div className="space-y-6">
               <h3 className="border-b pb-2 text-xl font-semibold tracking-tight">Professional Information</h3>
               <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="licenseNumber" render={({ field }) => (<FormItem><FormLabel>License Number</FormLabel><FormControl><Input placeholder="e.g., CISA-123456" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="role" render={({ field }) => (<FormItem><FormLabel>Current Role</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select your role" /></SelectTrigger></FormControl><SelectContent>{Object.values(AuditorRole).filter(role => role !== 'SUPERADMIN').map((role) => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="yearsExperience" render={({ field }) => (<FormItem><FormLabel>Years of Experience</FormLabel><FormControl><Input type="number" placeholder="5" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="payoutCurrency" render={({ field }) => (<FormItem><FormLabel>Payout Currency</FormLabel><Select onValueChange={field.onChange} value={field.value ?? ''}><FormControl><SelectTrigger><SelectValue placeholder="Select a currency" /></SelectTrigger></FormControl><SelectContent>{Object.values(Currency).map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent></Select><FormDescription>This is the currency you'll receive payments in.</FormDescription><FormMessage /></FormItem>)}/>
               </div>
            </div>

            {/* Section 3: Skills & Expertise */}
            <div className="space-y-6">
              <h3 className="border-b pb-2 text-xl font-semibold tracking-tight">Skills & Expertise</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField control={form.control} name="specialties" render={({ field }) => (<FormItem><FormLabel>Specialties</FormLabel><FormControl><MultiSelectCreatable options={PREDEFINED_SPECIALTIES} value={field.value ?? []} onChange={field.onChange} placeholder='Select or create specialties...'/></FormControl><FormMessage /></FormItem>)}/>
                <FormField control={form.control} name="languages" render={({ field }) => (<FormItem><FormLabel>Languages Spoken</FormLabel><FormControl><MultiSelectCreatable options={PREDEFINED_LANGUAGES} value={field.value ?? []} onChange={field.onChange} placeholder='Select or create languages...'/></FormControl><FormMessage /></FormItem>)}/>
              </div>
            </div>

            {/* Section 4: Portfolio & Documents */}
            <div className="space-y-6">
              <h3 className="border-b pb-2 text-xl font-semibold tracking-tight">Portfolio & Documents</h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <FormLabel>Portfolio Links</FormLabel>
                  <FormDescription className='text-xs'>Links to public audit reports or your GitHub profile.</FormDescription>
                  <div className='mt-2 space-y-2'>
                    {portfolioFields.map((field, index) => (<FormField control={form.control} key={field.id} name={`portfolioLinks.${index}.value`} render={({ field }) => (<FormItem><FormControl><div className='flex items-center gap-2'><Input {...field} placeholder='https://github.com/johndoe/audits'/><Button type='button' variant='ghost' size='icon' onClick={() => removePortfolio(index)}><Trash2 className='text-destructive h-4 w-4' /></Button></div></FormControl><FormMessage /></FormItem>)}/>))}
                  </div>
                  <Button type='button' variant='outline' size='sm' className='mt-2' onClick={() => appendPortfolio({ value: '' })}><PlusCircle className='mr-2 h-4 w-4' />Add Link</Button>
                </div>
                <div className='space-y-2'>
                  <FormLabel>Supporting Documents</FormLabel>
                  <FormDescription className='text-xs'>Upload your license, certifications, or CV (PDF only).</FormDescription>
                  <div className='relative'>
                    <label htmlFor='file-upload' className='text-primary hover:text-primary-focus relative cursor-pointer rounded-md font-medium'>
                      <div className='border-muted hover:border-primary flex items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors'>
                        <div className='text-center'>
                          <FileUp className='text-muted-foreground mx-auto h-12 w-12' />
                          <p className='text-muted-foreground mt-2 text-sm'><span className='text-primary font-semibold'>Click to upload</span> or drag and drop</p>
                        </div>
                      </div>
                    </label>
                    <Input id='file-upload' type='file' className='sr-only' multiple accept='.pdf' onChange={handleFileChange}/>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className='space-y-2 pt-2'>
                      <h4 className='text-sm font-medium'>Selected files:</h4>
                      <div className='space-y-2 rounded-md border p-2'>
                        {selectedFiles.map((file, index) => (<div key={index} className='flex items-center justify-between text-sm'><div className='flex items-center gap-2 truncate'><FileText className='h-4 w-4 flex-shrink-0' /><span className='truncate'>{file.name}</span><span className='text-muted-foreground text-xs'>({(file.size / 1024).toFixed(1)} KB)</span></div><Button type='button' variant='ghost' size='icon' className='h-6 w-6' onClick={() => removeFile(file)}><X className='text-destructive h-4 w-4' /></Button></div>))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
              {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</>) : ("Submit Registration")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}