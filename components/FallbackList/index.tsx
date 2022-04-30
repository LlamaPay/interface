import { useNetworkProvider } from 'hooks';
import { useAccount } from 'wagmi';

interface FallbackProps {
  isLoading?: boolean;
  isError: boolean;
  noData: boolean;
  type: 'streams' | 'history' | 'balances' | 'payeesList';
}

const Fallback = ({ isLoading, isError, noData, type }: FallbackProps) => {
  const [{ data: accountData }] = useAccount();

  const { unsupported } = useNetworkProvider();

  let errorMessage = "Couldn't load data";
  let emptyDataMessage = '';
  let defaultMessage: string | null = null;

  switch (type) {
    case 'streams':
      errorMessage = "Couldn't load streams";
      emptyDataMessage = 'Create a Stream to see a list of your Streams created here';
      defaultMessage = !accountData
        ? 'Connect wallet to view your streams'
        : unsupported
        ? 'Network not supported'
        : null;
      break;
    case 'history':
      errorMessage = "Couldn't load historical data";
      emptyDataMessage = 'To check the movements of your streams, Create a Stream first';
      defaultMessage = !accountData
        ? 'Connect wallet to view your streams history'
        : unsupported
        ? 'Network not supported'
        : null;
      break;
    case 'balances':
      errorMessage = "Couldn't load balances";
      emptyDataMessage = 'Create a Balance First';
      defaultMessage = !accountData
        ? 'Connect wallet to view your balances'
        : unsupported
        ? 'Network not supported'
        : null;
      break;
    case 'payeesList':
      errorMessage = "Couldn't load payees";
      emptyDataMessage = 'Create a stream to view payees list';
      defaultMessage = !accountData
        ? 'Connect wallet to view payees list'
        : unsupported
        ? 'Network not supported'
        : null;
      break;
  }

  return (
    <div className="flex h-14 w-full items-center justify-center rounded border border-dashed border-[#626262] text-xs font-semibold">
      {defaultMessage ||
        (isLoading ? null : isError ? <p>{errorMessage}</p> : noData ? <p>{emptyDataMessage}</p> : null)}
    </div>
  );
};

export default Fallback;
