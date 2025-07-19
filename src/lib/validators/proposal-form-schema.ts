import { z } from "zod";


// Ensure your enums are exported if they are in this file
export enum Currency {
  EUR = "EUR",
  USD = "USD",
  GBP = "GBP",
  INR = "INR",
  AED = "AED",
  OTHER = "OTHER",
}

export const ProposalFormSchema = z.object({
  proposalName: z.string().min(5, { message: "Proposal name must be at least 5 characters." }),
  description: z.string().min(20, { message: "Description must be detailed (at least 20 characters)." }),
  quotation: z.coerce.number().positive({ message: "Quotation must be a positive number." }),
  currency: z.nativeEnum(Currency, { required_error: "Please select a currency." }),
  estimatedDuration: z.coerce.number().int().positive({ message: "Duration must be a positive number of days." }),
  
  // --- THIS IS THE FINAL, CORRECT SCHEMA FOR THE DATE RANGE ---
  dateRange: z.object({
      // 1. Make the individual date properties optional.
      // This allows the initial state in the form to be `undefined`.
      from: z.date().optional(),
      to: z.date().optional(),
    }),

  requestNote: z.string().min(1, { message: "A note to the client is required." }),
  terms: z.array(z.object({ value: z.string().min(1, { message: "Term cannot be empty." }) })).optional(),
  deliverables: z.array(z.object({ value: z.string().min(1, { message: "Deliverable cannot be empty." }) })).optional(),
})
// Add separate `.refine()` checks for clarity and better error messages.
.refine((data) => {
    // 2. This refine check ensures BOTH dates are present upon submission.
    return !!data.dateRange.from && !!data.dateRange.to;
}, {
    message: "Both a start and end date are required.",
    path: ["dateRange"], // Associate the error with the date picker UI.
})
.refine((data) => {
    // 3. This refine check ensures the date ordering is correct.
    // It only runs if both dates are present, thanks to the previous refine.
    if (data.dateRange.from && data.dateRange.to) {
        return data.dateRange.to > data.dateRange.from;
    }
    return true; // Pass if the first refine already caught the missing dates.
}, {
    message: "End date must be after the start date.",
    path: ["dateRange"], // Associate this error with the date picker UI as well.
});