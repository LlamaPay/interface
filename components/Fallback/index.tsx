import { useNetworkProvider } from 'hooks';
import { useTranslations } from 'next-intl';
import React from 'react';
import { BeatLoader } from 'react-spinners';
import { useAccount } from 'wagmi';

interface FallbackProps {
  isLoading?: boolean;
  isError: boolean;
  noData: boolean;
  type: 'streams' | 'history' | 'balances' | 'payeesList' | 'vestingStreams';
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
  }

  const loader = showLoader ? (
    <span className="relative top-[2px]">
      <BeatLoader size={6} />
    </span>
  ) : null;

  return (
    <FallbackContainer>
      {defaultMessage ||
        (isLoading ? loader : isError ? <p>{errorMessage}</p> : noData ? <p>{emptyDataMessage}</p> : null)}
    </FallbackContainer>
  );
};

export function FallbackContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-14 w-full items-center justify-center rounded border border-dashed border-[#626262] text-xs font-semibold">
      {children}
    </div>
  );
}

export default Fallback;
