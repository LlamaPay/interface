import { FallbackContainer } from '~/components/Fallback';
import Layout from '~/components/Layout';
import CreatePayment from '~/components/Payments/create';
import { useNetworkProvider } from '~/hooks';
import { GetStaticPropsContext, NextPage } from 'next';
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

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      // You can get the messages from anywhere you like. The recommended
      // pattern is to put them in JSON files separated by language.
      messages: (await import(`translations/${context.locale}.json`)).default,
    },
  };
}
export default Create;
