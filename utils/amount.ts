export function formatBalance(balance: number) {
  return balance.toLocaleString('en-US', { maximumFractionDigits: 5, minimumFractionDigits: 5 });
}

export function formatAmountInHistory(amtPerSec: number, duration: number) {
  const formatted = (amtPerSec * duration).toLocaleString('en-US', { maximumFractionDigits: 5 });
  if (formatted === '0') {
    return '0...';
  }
  return formatted;
}
