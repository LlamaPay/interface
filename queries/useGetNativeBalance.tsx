import { useBalance } from 'wagmi';

export function useGetNativeBalance(id: string) {
  const [{ data, error, loading }] = useBalance({
    addressOrName: id.toLowerCase(),
  });

  if (error) return <p>Failed to Get Balance</p>;
  if (loading) return <p>Loading Balance</p>;
  return <p>{(Number(data?.value) / 1e18).toLocaleString('en-US', { maximumFractionDigits: 5 })}</p>;
}
