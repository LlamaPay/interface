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
      {isLoading
        ? 'Loading'
        : isError
        ? 'Error'
        : `${balance.toLocaleString(locale, { maximumFractionDigits: 5 })} ${network.nativeCurrency?.symbol}`}
    </>
  );
}
