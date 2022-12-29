import * as React from 'react';
import { useNetworkProvider } from 'hooks';
import { useTranslations } from 'next-intl';
import { BeatLoader } from 'react-spinners';
import { useAccount } from 'wagmi';

interface FallbackProps {
  isLoading?: boolean;
  isError: boolean;
  noData: boolean;
  type: 'streams' | 'history' | 'balances' | 'payeesList' | 'vestingStreams' | 'payments';
  showLoader?: boolean;
  supressWalletConnection?: boolean;
}

const Fallback = ({ isLoading, isError, noData, type, supressWalletConnection, showLoader }: FallbackProps) => {
  const [{ data: basicAccountData }] = useAccount();

  const accountData = supressWalletConnection === true || basicAccountData !== undefined;

  const { unsupported } = useNetworkProvider();
  const t0 = useTranslations('Common');
  const t1 = useTranslations('Balances');
  const t2 = useTranslations('Streams');
  const t3 = useTranslations('History');
  const t4 = useTranslations('Payees');

  let errorMessage = t0('error');
  let emptyDataMessage = '';
  let defaultMessage: string | null = null;

  switch (type) {
    case 'balances':
      errorMessage = t1('error');
      emptyDataMessage = t1('noData');
      defaultMessage = !accountData ? t1('connectWallet') : unsupported ? t0('networkNotSupported') : null;
      break;
    case 'streams':
      errorMessage = t2('error');
      emptyDataMessage = t2('noData');
      defaultMessage = !accountData ? t2('connectWallet') : unsupported ? t0('networkNotSupported') : null;
      break;
    case 'history':
      errorMessage = t3('error');
      emptyDataMessage = t3('noData');
      defaultMessage = !accountData ? t3('connectWallet') : unsupported ? t0('networkNotSupported') : null;
      break;
    case 'payeesList':
      errorMessage = t4('error');
      emptyDataMessage = t4('noData');
      defaultMessage = !accountData ? t4('connectWallet') : unsupported ? t0('networkNotSupported') : null;
      break;
    case 'vestingStreams':
      errorMessage = t0('error');
      emptyDataMessage = 'Create a Vesting Contract to see a list of your streams';
      defaultMessage = !accountData
        ? 'Connect Wallet to see your vesting streams'
        : unsupported
        ? t0('networkNotSupported')
        : null;
      break;
    case 'payments':
      errorMessage = t0('error');
      emptyDataMessage = 'Create a Payment to see a list of payments';
      defaultMessage = !accountData
        ? 'Connect Wallet to see your payments'
        : unsupported
        ? t0('networkNotSupported')
        : null;
      break;
  }

  return (
    <FallbackContainer>
      {defaultMessage ||
        (isLoading ? (
          <FallbackContainerLoader />
        ) : isError ? (
          <p>{errorMessage}</p>
        ) : noData ? (
          <p>{emptyDataMessage}</p>
        ) : null)}
    </FallbackContainer>
  );
};

export function FallbackContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[3.5rem] w-full items-center justify-center break-all rounded border border-dashed border-[#626262] px-3 text-xs font-semibold">
      {children}
    </div>
  );
}

export const FallbackContainerLoader = () => (
  <span className="relative top-[2px]">
    <BeatLoader size={6} />
  </span>
);

export default Fallback;
