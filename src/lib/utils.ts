import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format as formatDateFns } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}










export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return 'N/A';
  try {
    // 'PPP' is a nice, long-form date format like "Jul 20th, 2025"
    return formatDateFns(new Date(dateString), 'PPP');
  } catch (error) {
    console.error("Invalid date provided to formatDate:", dateString, error);
    return 'Invalid Date';
  }
}


export function formatCurrency(amount: number | null | undefined, currency: string = 'USD'): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Not specified';
  }
  
  // This uses the browser's built-in Intl API for robust currency formatting.
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
