export function formatBalance(balance: number, intl: any, fDigits?: number) {
  return intl.formatNumber(balance, { maximumFractionDigits: fDigits || 5, minimumFractionDigits: fDigits || 5 });
}

export function formatAmountInTable(amtPerSec: number, duration: number, intl: any) {
  const formatted = intl.formatNumber(amtPerSec * duration, { maximumFractionDigits: 5 });
  if (formatted === '0') {
    return '0...';
  }
  return formatted;
}
