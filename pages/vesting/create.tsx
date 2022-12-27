import { FallbackContainer } from 'components/Fallback';
import Layout from 'components/Layout';
import CreateVesting from 'components/Vesting/create';
import CreateGnosisVesting from 'components/Vesting/create-gnosis';
import { useNetworkProvider } from 'hooks';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslations } from 'next-intl';
import { networkDetails } from 'utils/constants';
import { useAccount } from 'wagmi';

const Create: NextPage = () => {
  const [{ data: accountData }] = useAccount();
  const { unsupported } = useNetworkProvider();
  const { chainId } = useNetworkProvider();

  const t = useTranslations('CreateStream');

  const factory = chainId ? networkDetails[chainId]?.vestingFactory : null;

  return (
    <Layout>
      {factory ? (
        process.env.NEXT_PUBLIC_SAFE === 'true' ? (
          <CreateGnosisVesting factory={factory} />
        ) : (
          <CreateVesting factory={factory} />
        )
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

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  // Pass data to the page via props
  return {
    props: {
      messages: (await import(`translations/${locale}.json`)).default,
    },
  };
};

export default Create;
