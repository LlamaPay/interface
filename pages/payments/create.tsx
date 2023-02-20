import { FallbackContainer } from '~/components/Fallback';
import Layout from '~/components/Layout';
import CreatePayment from '~/components/Payments/create';
import { useNetworkProvider } from '~/hooks';
import { NextPage } from 'next';
import { useTranslations } from 'next-intl';
import { networkDetails } from '~/lib/networkDetails';
import { useAccount } from 'wagmi';

const Create: NextPage = () => {
  const { isConnected } = useAccount();
  const { chainId, unsupported } = useNetworkProvider();
  const t = useTranslations('CreateStream');
  const paymentsContract =
    chainId && networkDetails[chainId].paymentsContract ? networkDetails[chainId].paymentsContract : null;

  return (
    <Layout>
      {paymentsContract ? (
        <CreatePayment contract={paymentsContract} />
      ) : (
        <>
          <span className="font-exo text-2xl font-semibold text-lp-gray-4 dark:text-white">Set Up Payments</span>
          <FallbackContainer>
            <p>{!isConnected ? t('connectWallet') : unsupported ? t('notSupported') : t('sus')}</p>
          </FallbackContainer>
        </>
      )}
    </Layout>
  );
};

export default Create;
