export function formatBalance(balance: number, locale: string) {
  return balance.toLocaleString(locale, { maximumFractionDigits: 5, minimumFractionDigits: 5 });
}

export function formatAmountInTable(amtPerSec: number, duration: number, locale: string) {
  const formatted = (amtPerSec * duration).toLocaleString(locale, { maximumFractionDigits: 5 });
  if (formatted === '0') {
    return '0...';
  }
  return formatted;
}
