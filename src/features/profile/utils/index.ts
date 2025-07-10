// Utility functions extracted from profile page

export function normalizeReminders(obj: Record<string, unknown>): { [licenseId: number]: number[] } {
  const result: { [licenseId: number]: number[] } = {};
  for (const key in obj) {
    const val = obj[key];
    const numKey = Number(key);
    if (Array.isArray(val) && val.every(v => typeof v === 'number')) {
      result[numKey] = val as number[];
    } else if (typeof val === 'number') {
      result[numKey] = [val];
    }
  }
  return result;
}

export function getExpiryStatus(expiryDate: string) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) return 'Expired';
  if (daysUntilExpiry <= 30) return 'Expiring Soon';
  return 'Active';
}

export function getStatusColor(status: string, isDark: boolean) {
  switch (status) {
    case 'Active': return isDark ? 'text-green-400' : 'text-green-600';
    case 'Expiring Soon': return isDark ? 'text-yellow-400' : 'text-yellow-600';
    case 'Expired': return isDark ? 'text-red-400' : 'text-red-600';
    default: return isDark ? 'text-gray-400' : 'text-gray-600';
  }
} 