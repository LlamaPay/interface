export default function formatBalance(balance: number) {
  return balance.toLocaleString('en-US', { maximumFractionDigits: 5, minimumFractionDigits: 5 });
}
