import { FallbackContainer } from '~/components/Fallback';
import Layout from '~/components/Layout';
import CreateVesting from '~/components/Vesting/create';
import CreateGnosisVesting from '~/components/Vesting/create-gnosis';
import { useNetworkProvider } from '~/hooks';
import type { GetStaticPropsContext, NextPage } from 'next';
import { useTranslations } from 'next-intl';
import { networkDetails } from '~/lib/networkDetails';
import { useAccount } from 'wagmi';
import { VESTING_FACTORY_V2 } from '~/lib/contracts';

const Create: NextPage = () => {
  const { isConnected } = useAccount();
  const { unsupported } = useNetworkProvider();
  const { chainId } = useNetworkProvider();

  const t = useTranslations('CreateStream');

  // const factory = chainId ? networkDetails[chainId]?.vestingFactory : null;
  const factory = VESTING_FACTORY_V2;

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
