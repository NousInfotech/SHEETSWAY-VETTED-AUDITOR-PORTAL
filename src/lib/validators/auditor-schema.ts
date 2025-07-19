import { z } from 'zod';

export enum AuditorRole {
  JUNIOR = 'JUNIOR',
  SENIOR = 'SENIOR',
  PARTNER = 'PARTNER',
  SUPERADMIN = 'SUPERADMIN'
}
export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  INR = 'INR',
  AED = 'AED',
  OTHER = 'OTHER'
}
export enum AccountStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  BANNED = 'BANNED'
}
export enum VettedStatus {
  NOT_APPLIED = 'NOT_APPLIED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// THE UNIFIED FORM SCHEMA
export const AuditorFormSchema = z
  .object({
    // Profile Fields
    name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
    licenseNumber: z
      .string()
      .min(5, { message: 'A valid license number is required.' }),
    role: z.nativeEnum(AuditorRole, {
      required_error: 'Please select a role.'
    }),
    yearsExperience: z.coerce.number().int().min(0),
    payoutCurrency: z.nativeEnum(Currency).nullable().optional(),
    specialties: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional(),
    portfolioLinks: z.array(z.object({ value: z.string().url() })).optional(),
    stripeAccountId: z.string().optional(),

    // Admin-editable field
    accountStatus: z.nativeEnum(AccountStatus).optional(),

    // Auth Fields (for create mode)
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
    confirmPassword: z.string().optional()
  })
  .refine(
    (data) => {
      if (data.password) return data.password === data.confirmPassword;
      return true;
    },
    {
      message: 'Passwords do not match.',
      path: ['confirmPassword']
    }
  );
