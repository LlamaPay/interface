import { useDialogState } from 'ariakit';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';
import Layout from '~/components/Layout';
import { WalletSelector } from '~/components/Web3';
import { useIsMounted } from '~/hooks';
import { Box } from '~/containers/common/Box';
import { Vesting } from './Vesting';
import { Salary } from './Salary';
import { Payments } from './Payments';
import { TokenSalary } from './TokenSalary';

export const OutgoingDashboard = ({ userAddress }: { userAddress?: string; chainId?: number }) => {
  const isMounted = useIsMounted();
  const { address } = useAccount();
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

  // if (!finalChainId) {
  //   return (
  //     <Layout>
  //       <Box className="grid min-h-[calc(100vh-147px)] items-center">
  //         <button
  //           className="mx-auto w-fit rounded-lg border py-2 px-4 dark:border-lp-gray-7"
  //           onClick={walletDialog.toggle}
  //         >
  //           {t('networkNotSupported')}
  //         </button>
  //       </Box>
  //       <WalletSelector dialog={walletDialog} />
  //     </Layout>
  //   );
  // }

  return (
    <Layout className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Salary userAddress={finalAddress} />
      <Vesting userAddress={finalAddress} />
      <Payments userAddress={finalAddress} />
      <TokenSalary userAddress={finalAddress} />
    </Layout>
  );
};
