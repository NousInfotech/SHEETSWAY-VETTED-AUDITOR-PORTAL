import { z } from 'zod';

// Mock Enums (Replace with your actual data source)
// A real app would have a much larger list of countries
// export enum Country {
//   USA = "United States",
//   CAN = "Canada",
//   GBR = "United Kingdom",
//   DEU = "Germany",
//   JPN = "Japan",
//   SGP = "Singapore",
//   CHE = "Switzerland",
// }

export enum Country {
  GERMANY = 'GERMANY',
  FRANCE = 'FRANCE',
  MALTA = 'MALTA',
  UAE = 'UAE',
  INDIA = 'INDIA',
  UK = 'UK',
  USA = 'USA',
  NETHERLANDS = 'NETHERLANDS',
  IRELAND = 'IRELAND',
  OTHER = 'OTHER'
}

// export enum FirmSize {
//   SOLE_PROPRIETOR = "1",
//   SMALL = "2-10",
//   MEDIUM = "11-50",
//   LARGE = "51-200",
//   ENTERPRISE = "200+",
// }
export enum FirmSize {
  SOLO = 'SOLO',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}


// export enum Currency {
//   USD = 'USD',
//   EUR = 'EUR',
//   GBP = 'GBP',
//   JPY = 'JPY'
// }

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  INR = 'INR',
  AED = 'AED',
  OTHER = 'OTHER'
}

// We create a specific schema for the registration form,
// including only the fields the user should fill out.
export const AuditFirmFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Firm name must be at least 2 characters.' }),
  licenseNumber: z
    .string()
    .min(5, { message: 'A valid business license number is required.' }),
  registeredIn: z.nativeEnum(Country, {
    required_error: 'Please select the country of registration.'
  }),
  firmSize: z.nativeEnum(FirmSize, {
    required_error: 'Please select the firm size.'
  }),

  // Optional fields
  registeredOn: z.date().optional(),
  payoutCurrency: z.nativeEnum(Currency).optional().nullable(),

  // Array fields
  operatingCountries: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  portfolioLinks: z
    .array(
      z.object({
        value: z.string().url({ message: 'Please enter a valid URL.' })
      })
    )
    .optional(),

  // File upload field
  supportingDocs: z.any().optional()
});
