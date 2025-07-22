import * as z from 'zod';

// Define TS Enums first, as provided
export enum AuditorRole {
  JUNIOR = "JUNIOR",
  SENIOR = "SENIOR",
  PARTNER = "PARTNER",
  SUPERADMIN = "SUPERADMIN",
}

export enum AccountStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  BANNED = "BANNED",
}

export enum VettedStatus {
  NOT_APPLIED = "NOT_APPLIED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  INR = "INR",
  AED = "AED",
  OTHER = "OTHER",
}

// The main Zod schema for the form, including auth fields for creation
export const AuditorFormSchema = z.object({
  // Auth fields (for creation form)
  email: z.string().email({ message: "Invalid email address." }).optional(),
  password: z.string().min(8, "Password must be at least 8 characters.").optional(),
  confirmPassword: z.string().optional(),
  
  // Core Auditor Profile Fields from your schema
  auditFirmId: z.preprocess(
    
    (val) => (val === "" ? undefined : val),
    
    z.string().uuid({ message: "Must be a valid UUID format." }).optional().nullable()
  ),
  role: z.nativeEnum(AuditorRole).default(AuditorRole.JUNIOR),
  name: z.string().min(1, "Name is required."),
  licenseNumber: z.string().min(1, "License number is required."),
  yearsExperience: z.coerce.number().int().min(0, "Years of experience must be a positive number."),
  specialties: z.array(z.string()).optional().default([]),
  languages: z.array(z.string()).optional().default([]),
  
  // Array of objects for the form's useFieldArray, will be transformed on submit
  portfolioLinks: z.array(z.object({ value: z.string().url({ message: "Please enter a valid URL." }) })).optional().default([]),
  
  supportingDocs: z.array(z.string().url()).optional().default([]),
  
  // Statuses
  accountStatus: z.nativeEnum(AccountStatus).default(AccountStatus.PENDING),
  vettedStatus: z.nativeEnum(VettedStatus).default(VettedStatus.NOT_APPLIED),
  
  // Financial
  stripeAccountId: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional().nullable()
  ),
  payoutCurrency: z.nativeEnum(Currency).optional().nullable(),

  // Performance Metrics (using coerce for form inputs to handle strings)
  avgResponseTime: z.coerce.number().int().optional().nullable(),
  avgCompletion: z.coerce.number().int().optional().nullable(),
  successCount: z.coerce.number().int().optional().nullable(),
  rating: z.coerce.number().min(0, "Rating cannot be negative.").max(5, "Rating cannot be more than 5.").optional().nullable(),
  reviewsCount: z.coerce.number().int().optional().nullable(),
}).refine((data) => {
    // Only validate passwords if the password field is present and filled
    if (data.password && data.password !== data.confirmPassword) {
      return false;
    }
    return true;
  }, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Apply error to the confirmPassword field
});