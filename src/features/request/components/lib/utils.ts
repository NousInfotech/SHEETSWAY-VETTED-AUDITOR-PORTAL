import { format } from 'date-fns';

/**
 * Formats an ISO date string into a more readable format (e.g., "July 20, 2025").
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A';
  return format(new Date(dateString), 'PPP'); // PPP is a nice format like "Jul 20th, 2025"
}

/**
 * Formats a number into a currency string.
 * @param amount The amount in minor units (e.g., cents, fils).
 * @param currency The currency code (e.g., "USD", "AED").
 */
export function formatCurrency(amount: number | null | undefined, currency: string = 'USD'): string {
  if (amount === null || amount === undefined) return 'Not specified';
  
  const amountInMajorUnits = amount / 100; // Assuming the amount is in cents/fils
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amountInMajorUnits);
}