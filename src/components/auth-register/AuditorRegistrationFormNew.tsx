// 'use client';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm, useFieldArray } from 'react-hook-form';
// import * as z from 'zod';
// import {
//   AuditorFormSchema,
//   AuditorRole,
//   Currency,
//   AccountStatus,
//   VettedStatus
// } from '@/lib/validators/auditor-schema';
// import { AuditorProfile } from '@/stores/useProfileStore';

// import { toast } from 'sonner';
// import axios from 'axios';
// import {
//   createAuditor,
//   updateAuditor,
//   UpdateAuditorPayload,
//   CreateAuditorPayload
// } from '@/lib/services/auditorService';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription
// } from '@/components/ui/card';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem
// } from '@/components/ui/select';
// import { MultiSelectCreatable } from '@/components/ui/multi-select-creatable';
// import { Separator } from '@/components/ui/separator';
// import { Loader2, PlusCircle, Trash2, Paperclip, X } from 'lucide-react';
// import { useState, useEffect, useRef } from 'react';
// import { cn } from '@/lib/utils';
// import { upload } from '@vercel/blob/client';

// type FormValues = z.infer<typeof AuditorFormSchema>;

// interface AuditorFormProps {
//   auditorToEdit?: AuditorProfile | null;
//   onFormSubmit?: () => void;
//   isModalMode?: boolean;
// }

// const PREDEFINED_SPECIALTIES = [
//   'IFRS',
//   'Tax Compliance',
//   'Smart Contract Audit',
//   'SOC 2'
// ];
// const PREDEFINED_LANGUAGES = ['English', 'Arabic', 'German', 'Spanish'];

// export function AuditorRegistrationFormNew({
//   auditorToEdit,
//   onFormSubmit,
//   isModalMode = false
// }: AuditorFormProps) {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const inputFileRef = useRef<HTMLInputElement>(null);
//   const isEditMode = !!auditorToEdit;

//   const form = useForm<FormValues>({
//     resolver: zodResolver(AuditorFormSchema),
//     defaultValues: {
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       licenseNumber: '',
//       role: AuditorRole.JUNIOR,
//       yearsExperience: 0,
//       payoutCurrency: undefined,
//       accountStatus: AccountStatus.PENDING,
//       vettedStatus: VettedStatus.NOT_APPLIED,
//       stripeAccountId: '',
//       auditFirmId: '',
//       specialties: [],
//       languages: [],
//       portfolioLinks: [],
//       supportingDocs: [],
//       rating: undefined,
//       reviewsCount: undefined,
//       successCount: undefined,
//       avgResponseTime: undefined,
//       avgCompletion: undefined
//     },
//     mode: 'onChange'
//   });

//   useEffect(() => {
//     if (isEditMode && auditorToEdit) {
//       form.reset({
//         ...auditorToEdit,
//         payoutCurrency: auditorToEdit.payoutCurrency || undefined,
//         stripeAccountId: auditorToEdit.stripeAccountId || '',
//         auditFirmId: auditorToEdit.auditFirmId || '',
//         portfolioLinks:
//           auditorToEdit.portfolioLinks?.map((link) => ({ value: link })) || []
//       });
//     }
//   }, [auditorToEdit, isEditMode, form.reset]);

//   const {
//     fields: portfolioFields,
//     append: appendPortfolioLink,
//     remove: removePortfolioLink
//   } = useFieldArray({ name: 'portfolioLinks', control: form.control });
//   const { setValue, getValues } = form;

//   const handleFileChange = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     if (!event.target.files) {
//       toast.error('No file selected.');
//       return;
//     }
//     setIsUploading(true);
//     try {
//       const files = Array.from(event.target.files);
//       const newBlobs = await Promise.all(
//         files.map((file) =>
//           upload(file.name, file, {
//             access: 'public',
//             handleUploadUrl: '/api/upload'
//           })
//         )
//       );
//       const newUrls = newBlobs.map((blob) => blob.url);
//       const currentDocs = getValues('supportingDocs') || [];
//       setValue('supportingDocs', [...currentDocs, ...newUrls], {
//         shouldValidate: true
//       });
//       toast.success(`${files.length} file(s) uploaded successfully!`);
//     } catch (error) {
//       toast.error('File upload failed.');
//     } finally {
//       setIsUploading(false);
//       if (inputFileRef.current) inputFileRef.current.value = '';
//     }
//   };

//   const removeDocument = (urlToRemove: string) => {
//     const updatedDocs = (getValues('supportingDocs') || []).filter(
//       (url) => url !== urlToRemove
//     );
//     setValue('supportingDocs', updatedDocs, { shouldValidate: true });
//   };

//   async function onSubmit(data: FormValues) {
//     setIsSubmitting(true);
//     try {
//       if (isEditMode && auditorToEdit) {
//         const payload: UpdateAuditorPayload = {
//           name: data.name,
//           licenseNumber: data.licenseNumber,
//           yearsExperience: data.yearsExperience,
//           role: data.role,
//           accountStatus: data.accountStatus,
//           vettedStatus: data.vettedStatus,
//           stripeAccountId: data.stripeAccountId,
//           payoutCurrency: data.payoutCurrency,
//           auditFirmId: data.auditFirmId,
//           specialties: data.specialties,
//           languages: data.languages,
//           supportingDocs: data.supportingDocs,
//           portfolioLinks: data.portfolioLinks
//             ?.map((link) => link.value)
//             .filter(Boolean),
//           rating: data.rating,
//           reviewsCount: data.reviewsCount,
//           successCount: data.successCount,
//           avgResponseTime: data.avgResponseTime,
//           avgCompletion: data.avgCompletion
//         };
//         // await updateAuditor(auditorToEdit.id, payload);
//         toast.success('Profile updated successfully!');
//       } else {
//         if (!data.email || !data.password)
//           throw new Error('Email and password are required.');
//         const payload: CreateAuditorPayload = {
//           auditor: {
//             email: data.email,
//             name: data.name,
//             licenseNumber: data.licenseNumber,
//             role: data.role,
//             yearsExperience: data.yearsExperience,
//             accountStatus: data.accountStatus,
//             vettedStatus: data.vettedStatus,
//             payoutCurrency: data.payoutCurrency,
//             stripeAccountId: data.stripeAccountId,
//             auditFirmId: data.auditFirmId,
//             specialties: data.specialties,
//             languages: data.languages,
//             supportingDocs: data.supportingDocs,
//             portfolioLinks: data.portfolioLinks
//               ?.map((link) => link.value)
//               .filter(Boolean)
//           }
//         };
//         // await createAuditor(payload);
//         console.log(payload);
//         toast.success('Auditor account created successfully!');
//       }
//       if (onFormSubmit) onFormSubmit();
//     } catch (error: any) {
//       const errorMessage = axios.isAxiosError(error)
//         ? error.response?.data?.message
//         : error.message;
//       toast.error('Submission Failed', {
//         description: errorMessage || 'An unexpected error occurred.'
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   }

//   const cardClasses = isModalMode
//     ? 'border-none shadow-none'
//     : 'mx-auto my-8 w-full max-w-4xl shadow-lg';

//   return (
//     <Card className={cn(cardClasses)}>
//       {!isEditMode && !isModalMode && (
//         <CardHeader>
//           <CardTitle className='text-2xl'>Register as a Auditor</CardTitle>
//           <CardDescription>
//             Create an account and professional profile for a new team member.
//           </CardDescription>
//         </CardHeader>
//       )}
//       <CardContent className={cn(isModalMode && 'p-1', 'pt-6')}>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-12'>
//             {!isEditMode && (
//               <div className='space-y-6'>
//                 <h3 className='text-xl font-semibold'>Account Credentials</h3>
//                 <Separator />
//                 <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
//                   <FormField
//                     control={form.control}
//                     name='email'
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Email</FormLabel>
//                         <FormControl>
//                           <Input
//                             type='email'
//                             placeholder='auditor@example.com'
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <div />
//                   <FormField
//                     control={form.control}
//                     name='password'
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Password</FormLabel>
//                         <FormControl>
//                           <Input
//                             type='password'
//                             placeholder='••••••••'
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                   <FormField
//                     control={form.control}
//                     name='confirmPassword'
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Confirm Password</FormLabel>
//                         <FormControl>
//                           <Input
//                             type='password'
//                             placeholder='••••••••'
//                             {...field}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>
//               </div>
//             )}

//             <div className='space-y-6'>
//               <h3 className='text-xl font-semibold'>
//                 Professional Information
//               </h3>
//               <Separator />
//               <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
//                 <FormField
//                   control={form.control}
//                   name='name'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Full Name</FormLabel>
//                       <FormControl>
//                         <Input placeholder='John Doe' {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name='licenseNumber'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>License Number</FormLabel>
//                       <FormControl>
//                         <Input placeholder='CISA-12345' {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name='yearsExperience'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Years of Experience</FormLabel>
//                       <FormControl>
//                         <Input
//                           type='number'
//                           {...field}
//                           value={field.value ?? ''}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name='role'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Role</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         value={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder='Select a role' />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {Object.values(AuditorRole).map((role) => (
//                             <SelectItem key={role} value={role}>
//                               {role}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name='auditFirmId'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Audit Firm ID (Optional)</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder='Enter UUID...'
//                           {...field}
//                           value={field.value ?? ''}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>

//             <div className='space-y-6'>
//               <h3 className='text-xl font-semibold'>Skills & Portfolio</h3>
//               <Separator />
//               <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
//                 <FormField
//                   control={form.control}
//                   name='specialties'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Specialties</FormLabel>
//                       <FormControl>
//                         <MultiSelectCreatable
//                           options={PREDEFINED_SPECIALTIES}
//                           value={field.value ?? []}
//                           onChange={field.onChange}
//                           placeholder='Select or create...'
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name='languages'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Languages</FormLabel>
//                       <FormControl>
//                         <MultiSelectCreatable
//                           options={PREDEFINED_LANGUAGES}
//                           value={field.value ?? []}
//                           onChange={field.onChange}
//                           placeholder='Select or create...'
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className='pt-4'>
//                 <FormLabel>Portfolio Links</FormLabel>
//                 <div className='mt-2 space-y-2'>
//                   {portfolioFields.map((item, index) => (
//                     <FormField
//                       key={item.id}
//                       control={form.control}
//                       name={`portfolioLinks.${index}.value`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormControl>
//                             <div className='flex items-center gap-2'>
//                               <Input
//                                 {...field}
//                                 placeholder='https://github.com/johndoe/audits'
//                               />
//                               <Button
//                                 type='button'
//                                 variant='ghost'
//                                 size='icon'
//                                 onClick={() => removePortfolioLink(index)}
//                               >
//                                 <Trash2 className='text-destructive h-4 w-4' />
//                               </Button>
//                             </div>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   ))}
//                 </div>
//                 <Button
//                   type='button'
//                   variant='outline'
//                   size='sm'
//                   className='mt-2'
//                   onClick={() => appendPortfolioLink({ value: '' })}
//                 >
//                   <PlusCircle className='mr-2 h-4 w-4' />
//                   Add Link
//                 </Button>
//               </div>
//             </div>

//             <div className='space-y-6'>
//               <h3 className='text-xl font-semibold'>Supporting Documents</h3>
//               <Separator />
//               <FormField
//                 control={form.control}
//                 name='supportingDocs'
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Upload Verification Documents</FormLabel>

//                     <div>
//                       <Button
//                         type='button'
//                         variant='outline'
//                         onClick={() => inputFileRef.current?.click()}
//                         disabled={isUploading}
//                       >
//                         {isUploading ? (
//                           <Loader2 className='mr-2 h-4 w-4 animate-spin' />
//                         ) : (
//                           <Paperclip className='mr-2 h-4 w-4' />
//                         )}
//                         {isUploading ? 'Uploading...' : 'Select Files'}
//                       </Button>
//                       <Input
//                         ref={inputFileRef}
//                         type='file'
//                         multiple
//                         className='hidden'
//                         onChange={handleFileChange}
//                         disabled={isUploading}
//                       />
//                     </div>
//                     <div className='mt-4 space-y-2'>
//                       {(field.value || []).map((url) => (
//                         <div
//                           key={url}
//                           className='flex items-center justify-between rounded-md border p-2'
//                         >
//                           <a
//                             href={url}
//                             target='_blank'
//                             rel='noopener noreferrer'
//                             className='truncate text-sm text-blue-600 hover:underline'
//                           >
//                             {url.split('/').pop()}
//                           </a>
//                           <Button
//                             type='button'
//                             size='icon'
//                             variant='ghost'
//                             onClick={() => removeDocument(url)}
//                           >
//                             <X className='h-4 w-4' />
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className='space-y-6'>
//               <h3 className='text-xl font-semibold'>Financial Information</h3>
//               <Separator />
//               <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
//                 <FormField
//                   control={form.control}
//                   name='stripeAccountId'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Stripe Account ID (Optional)</FormLabel>
//                       <FormControl>
//                         <Input
//                           placeholder='acct_...'
//                           {...field}
//                           value={field.value ?? ''}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name='payoutCurrency'
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Payout Currency</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         value={field.value ?? ''}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder='Select a currency' />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {Object.values(Currency).map((c) => (
//                             <SelectItem key={c} value={c}>
//                               {c}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>

//             {isEditMode && (
//               <>
//                 <div className='space-y-6'>
//                   <h3 className='text-xl font-semibold'>
//                     Admin Controls & Status
//                   </h3>
//                   <Separator />
//                   <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
//                     <FormField
//                       control={form.control}
//                       name='accountStatus'
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Account Status</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             value={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder='Set status' />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {Object.values(AccountStatus).map((s) => (
//                                 <SelectItem key={s} value={s}>
//                                   {s}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name='vettedStatus'
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Vetting Status</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             value={field.value}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder='Set status' />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {Object.values(VettedStatus).map((s) => (
//                                 <SelectItem key={s} value={s}>
//                                   {s}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>
//                 <div className='space-y-6'>
//                   <h3 className='text-xl font-semibold'>Performance Metrics</h3>
//                   <Separator />
//                   <div className='grid grid-cols-2 gap-6 md:grid-cols-3'>
//                     <FormField
//                       control={form.control}
//                       name='rating'
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Rating (0-5)</FormLabel>
//                           <FormControl>
//                             <Input
//                               type='number'
//                               step='0.1'
//                               {...field}
//                               value={field.value ?? ''}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name='reviewsCount'
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Reviews Count</FormLabel>
//                           <FormControl>
//                             <Input
//                               type='number'
//                               {...field}
//                               value={field.value ?? ''}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name='successCount'
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Successful Audits</FormLabel>
//                           <FormControl>
//                             <Input
//                               type='number'
//                               {...field}
//                               value={field.value ?? ''}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name='avgResponseTime'
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Avg. Response (hrs)</FormLabel>
//                           <FormControl>
//                             <Input
//                               type='number'
//                               {...field}
//                               value={field.value ?? ''}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name='avgCompletion'
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Avg. Completion (days)</FormLabel>
//                           <FormControl>
//                             <Input
//                               type='number'
//                               {...field}
//                               value={field.value ?? ''}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>
//               </>
//             )}

//             <Button
//               type='submit'
//               className='w-full md:w-auto'
//               disabled={isSubmitting || isUploading}
//             >
//               {(isSubmitting || isUploading) && (
//                 <Loader2 className='mr-2 h-4 w-4 animate-spin' />
//               )}
//               {isEditMode ? 'Save Changes' : 'Register Auditor'}
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }
