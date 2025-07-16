import { z } from "zod";

// Re-using or redefining enums needed for the form
export enum Country {
  GERMANY = "GERMANY",
  FRANCE = "FRANCE",
  MALTA = "MALTA",
  UAE = "UAE",
  INDIA = "INDIA",
  UK = "UK",
  USA = "USA",
  NETHERLANDS = "NETHERLANDS",
  IRELAND = "IRELAND",
  OTHER = "OTHER",
}

export enum FirmSize {
  SOLO = "SOLO",
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export enum Currency {
  EUR = "EUR",
  USD = "USD",
  GBP = "GBP",
  INR = "INR",
  AED = "AED",
  OTHER = "OTHER",
}

// This is the updated, comprehensive schema for the frontend form
export const FullFirmRegistrationSchema = z.object({
  // --- Firm Data Fields ---
  firmName: z.string().min(2, { message: "Firm name must be at least 2 characters." }),
  firmLicenseNumber: z.string().min(5, { message: "A valid business license number is required." }),
  // Added registeredOn to match the form UI
  registeredOn: z.date({ required_error: "Please select the registration date." }).optional(),
  registeredIn: z.nativeEnum(Country, { required_error: "Please select the country of registration." }),
  firmSize: z.nativeEnum(FirmSize, { required_error: "Please select the firm size." }),
  payoutCurrency: z.nativeEnum(Currency).optional().nullable(),
  operatingCountries: z.array(z.nativeEnum(Country)).min(1, "Select at least one operating country."),
  firmLanguages: z.array(z.string()).optional(),
  firmSpecialties: z.array(z.string()).optional(),
  portfolioLinks: z.array(z.object({ value: z.string().url({ message: "Please enter a valid URL." }) })).optional(),
  
  // --- Auth Fields ---
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
  // Added confirmPassword to match the form UI
  confirmPassword: z.string().min(8, { message: "Please confirm your password." }),

  // --- Initial Superadmin Auditor Fields ---
  adminName: z.string().min(2, { message: "Your name is required." }),
  adminLicenseNumber: z.string().min(5, { message: "Your auditor license number is required." }),
  adminYearsExperience: z.coerce.number().int().min(0, { message: "Experience cannot be negative." }),
  adminLanguages: z.array(z.string()).optional(),
  adminSpecialties: z.array(z.string()).optional(),
  
  // supportingDocs is handled separately and not validated here
  supportingDocs: z.any().optional(),
})
// Added a refine check for password confirmation
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Show error on the confirm password field
});