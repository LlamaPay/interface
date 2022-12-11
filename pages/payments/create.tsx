import { FallbackContainer } from 'components/Fallback';
import Layout from 'components/Layout';
import CreatePayment from 'components/Payments/create';
import { useNetworkProvider } from 'hooks';
import { NextPage } from 'next';
import { useTranslations } from 'next-intl';
import { networkDetails } from 'utils/constants';
import { useAccount } from 'wagmi';

const Create: NextPage = () => {
  const [{ data: accountData }] = useAccount();
  const { chainId, unsupported } = useNetworkProvider();
  const t = useTranslations('CreateStream');
  const paymentsContract = chainId
    ? networkDetails[chainId].paymentsContract
      ? networkDetails[chainId].paymentsContract
      : null
    : null;

  return (
    <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center space-y-6 pb-[10rem] dark:bg-lp-gray-8">
      {paymentsContract ? (
        <CreatePayment contract={paymentsContract} />
      ) : (
        <>
          <span className="font-exo text-2xl font-semibold text-lp-gray-4 dark:text-white">Set Up Vesting</span>
          <FallbackContainer>
            <p>{!accountData ? t('connectWallet') : unsupported ? t('notSupported') : t('sus')}</p>
          </FallbackContainer>
        </>
      )}
    </Layout>
  );
};

export default Create;
