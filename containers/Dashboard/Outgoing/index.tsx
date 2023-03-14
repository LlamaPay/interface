import { useDialogState } from 'ariakit';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';
import Layout from '~/components/Layout';
import { WalletSelector } from '~/components/Web3';
import { useIsMounted } from '~/hooks';
import { Box } from '~/containers/common/Box';

export const OutgoingDashboard = ({ userAddress, chainId }: { userAddress?: string; chainId?: number }) => {
  const isMounted = useIsMounted();
  const { address, isConnected } = useAccount();
  const walletDialog = useDialogState();
  const t = useTranslations('Common');

  if (!isMounted) {
    return (
      <Layout className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Box className="col-span-full min-h-[928px]"></Box>
      </Layout>
    );
  }

  if (!userAddress ? !isConnected : true) {
    return (
      <Layout className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Box className="col-span-full grid min-h-[928px] items-center">
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

  return (
    <Layout className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Box></Box>
      <Box></Box>
      <Box className="col-span-full min-h-[300px]"></Box>
      <Box className="col-span-full min-h-[300px]"></Box>
    </Layout>
  );
};
