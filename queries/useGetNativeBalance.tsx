import { useLocale } from 'hooks';
import { useBalance, useNetwork } from 'wagmi';

export function useGetNativeBalance(id: string) {
  const [{ data, error, loading }] = useBalance({
    addressOrName: id.toLowerCase(),
  });

  const [{ data: network }] = useNetwork();

  const nativeCoin = network.chain?.nativeCurrency?.symbol;

  const { locale } = useLocale();

  if (error) return <>Failed to Get Balance</>;
  if (loading) return <div className="animate-shimmer h-5 w-full"></div>;

  return <>{`${(Number(data?.value) / 1e18).toLocaleString(locale, { maximumFractionDigits: 5 })} ${nativeCoin}`}</>;
}
