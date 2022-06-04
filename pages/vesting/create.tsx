import Layout from 'components/Layout';
import CreateVesting from 'components/Vesting/CreateVesting';
import { useNetworkProvider } from 'hooks';
import { GetServerSideProps, NextPage } from 'next';
import { useTranslations } from 'next-intl';
import { networkDetails } from 'utils/constants';
import { useAccount } from 'wagmi';

const Create: NextPage = () => {
  const [{ data: accountData }] = useAccount();
  const { unsupported } = useNetworkProvider();
  const { chainId } = useNetworkProvider();
  const t = useTranslations('Common');

  const factory = chainId ? networkDetails[chainId]?.vestingFactory : null;

  return (
    <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center space-y-6 pb-8 dark:bg-[#161818]">
      {factory ? (
        <CreateVesting factory={factory} />
      ) : (
        <>
          <span className="font-exo text-2xl font-semibold text-[#3D3D3D] dark:text-white">Set Up Vesting</span>
          <div className="flex h-14 w-full items-center justify-center rounded border border-dashed border-[#626262] text-xs font-semibold">
            <p>{!accountData ? t('connectWallet') : unsupported ? t('networkNotSupported') : t('error')}</p>
          </div>
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
