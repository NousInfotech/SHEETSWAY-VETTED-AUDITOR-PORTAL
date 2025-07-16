import { z } from "zod";

// Enums from your Prisma schema
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

export enum Currency {
  EUR = "EUR",
  USD = "USD",
  GBP = "GBP",
  INR = "INR",
  AED = "AED",
  OTHER = "OTHER",
}

// This new schema is for the solo auditor registration form UI
export const SoloAuditorRegistrationSchema = z.object({
  // Auditor fields
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  licenseNumber: z.string().min(5, { message: "A valid license number is required." }),
  role: z.nativeEnum(AuditorRole, { required_error: "Please select a role." }),
  yearsExperience: z.coerce.number().int().min(0, { message: "Experience cannot be negative." }),
  payoutCurrency: z.nativeEnum(Currency).optional().nullable(),
  specialties: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  portfolioLinks: z.array(z.object({
    value: z.string().url({ message: "Please enter a valid URL." })
  })).optional(),
  
  // Auth fields
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),

  // File upload field (handled separately, not directly in form state)
  supportingDocs: z.any().optional(),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});