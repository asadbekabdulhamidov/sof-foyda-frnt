export function formatUZS(amount: number): string {
  return new Intl.NumberFormat('uz-UZ').format(Math.round(amount)) + " so'm";
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('uz-UZ').format(amount);
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function generateBarcodeNumber(): string {
  const prefix = '890';
  const random = Math.floor(100000000 + Math.random() * 900000000).toString();
  return prefix + random.slice(0, 9);
}
