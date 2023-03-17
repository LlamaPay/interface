import { useDialogState } from 'ariakit';
import { useTranslations } from 'next-intl';
import { useAccount, useNetwork } from 'wagmi';
import Layout from '~/components/Layout';
import { WalletSelector } from '~/components/Web3';
import { useIsMounted } from '~/hooks';
import { Box } from '~/containers/common/Box';
import { Vesting } from './Vesting';
import { Salary } from './Salary';
import { Payments } from './Payments';
import { TokenSalary } from './TokenSalary';

export const OutgoingDashboard = ({ userAddress, chainId }: { userAddress?: string; chainId?: number }) => {
  const isMounted = useIsMounted();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const walletDialog = useDialogState();
  const t = useTranslations('Common');

  if (!isMounted) {
    return (
      <Layout className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Box className="col-span-full min-h-[928px]"></Box>
      </Layout>
    );
  }

  const finalAddress = userAddress || address;
  const finalChainId = chainId || (chain && !chain.unsupported ? chain.id : null);

  if (!finalAddress) {
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

  if (!finalChainId) {
    return (
      <Layout className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Box className="col-span-full grid min-h-[928px] items-center">
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
    <Layout className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Salary userAddress={finalAddress} chainId={finalChainId} />
      <Vesting userAddress={finalAddress} chainId={finalChainId} />
      <Payments userAddress={finalAddress} chainId={finalChainId} />
      <TokenSalary userAddress={finalAddress} chainId={finalChainId} />
    </Layout>
  );
};
