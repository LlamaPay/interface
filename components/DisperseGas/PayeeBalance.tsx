import { useNetworkProvider } from '~/hooks';
import { useIntl } from 'next-intl';
import { useGetNativeBalance } from '~/queries/useGetNativeBalance';

interface PayeeBalanceProps {
  id: string;
}

export default function PayeeBalance({ id }: PayeeBalanceProps) {
  const { data, isLoading, isError } = useGetNativeBalance(id);
  const network = useNetworkProvider();
  const balance = Number(data) / 10 ** Number(network.nativeCurrency?.decimals);

  const intl = useIntl();

  return (
    <>
      {isLoading ? (
        <div className="animate-shimmer h-5 w-full dark:text-white"></div>
      ) : isError ? (
        <span className="dark:text-white">-</span>
      ) : (
        <span className="dark:text-white">
          {`${intl.formatNumber(balance, { maximumFractionDigits: 5 })} ${network.nativeCurrency?.symbol}`}
        </span>
      )}
    </>
  );
}
