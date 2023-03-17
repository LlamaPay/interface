import { useDialogState } from 'ariakit';
import { useTranslations } from 'next-intl';
import { useAccount, useNetwork } from 'wagmi';
import Layout from '~/components/Layout';
import { WalletSelector } from '~/components/Web3';
import { useIsMounted } from '~/hooks';
import { Box } from '~/containers/common/Box';
import { AllIncomeStreams } from './AllIncomeStreams';

export const VestingStreams = ({
  userAddress,
  chainId,
  isIncoming,
}: {
  userAddress?: string;
  chainId?: number;
  isIncoming?: boolean;
}) => {
  const isMounted = useIsMounted();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const walletDialog = useDialogState();

  const t = useTranslations('Common');

  if (!isMounted) {
    return (
      <Layout>
        <Box className="grid min-h-[calc(100vh-147px)] items-center"></Box>
      </Layout>
    );
  }

  const finalAddress = userAddress || address;
  const finalChainId = chainId || (chain && !chain.unsupported ? chain.id : null);

  if (!finalAddress) {
    return (
      <Layout>
        <Box className="grid min-h-[calc(100vh-147px)] items-center">
          <button
            className="mx-auto w-fit rounded-lg border py-2 px-4 dark:border-lp-gray-7"
            onClick={walletDialog.toggle}
          >
            {t('connectWallet')}
          </button>
        </Box>
        <WalletSelector dialog={walletDialog} />
      </Layout>
    );
  }

  if (!finalChainId) {
    return (
      <Layout>
        <Box className="grid min-h-[calc(100vh-147px)] items-center">
          <button
            className="mx-auto w-fit rounded-lg border py-2 px-4 dark:border-lp-gray-7"
            onClick={walletDialog.toggle}
          >
            {t('networkNotSupported')}
          </button>
        </Box>
        <WalletSelector dialog={walletDialog} />
      </Layout>
    );
  }

  return (
    <Layout className="flex flex-col gap-9">
      <AllIncomeStreams userAddress={finalAddress} chainId={finalChainId} isIncoming={isIncoming ? true : false} />
    </Layout>
  );
};
