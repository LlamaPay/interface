import { useLocale, useNetworkProvider } from 'hooks';
import { useGetNativeBalance } from 'queries/useGetNativeBalance';

interface PayeeBalanceProps {
  id: string;
}

export default function PayeeBalance({ id }: PayeeBalanceProps) {
  const { data, isLoading, isError } = useGetNativeBalance(id);
  const network = useNetworkProvider();
  const balance = Number(data) / 10 ** Number(network.nativeCurrency?.decimals);
  const { locale } = useLocale();

  return (
    <>
      {isLoading ? (
        <div className="animate-shimmer h-5 w-full"></div>
      ) : isError ? (
        '-'
      ) : (
        `${balance.toLocaleString(locale, { maximumFractionDigits: 5 })} ${network.nativeCurrency?.symbol}`
      )}
    </>
  );
}
