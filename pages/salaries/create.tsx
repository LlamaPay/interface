import type { GetStaticPropsContext, NextPage } from 'next';
import * as React from 'react';
import Layout from '~/components/Layout';
import { CreateStream } from '~/components/Stream';
import { useAccount } from 'wagmi';
import { useNetworkProvider } from '~/hooks';
import useStreamsAndHistory from '~/queries/useStreamsAndHistory';
import { StreamIcon } from '~/components/Icons';
import { useTranslations } from 'next-intl';
import { FallbackContainer } from '~/components/Fallback';

const Create: NextPage = () => {
  const { isConnected } = useAccount();
  const { unsupported } = useNetworkProvider();

  // keep query active in this page so when a stream is submitted this query is invalidated and user can see the data when they navigate to homepage
  useStreamsAndHistory();

  const t = useTranslations('CreateStream');

  return (
    <Layout>
      {!isConnected || unsupported ? (
        <section className="z-2 mx-auto flex w-full max-w-lg flex-col">
          <h1 className="font-exo mb-5 flex items-center gap-[0.625rem] text-2xl font-semibold text-lp-gray-4">
            <StreamIcon />
            <span>{t('createANewStream')}</span>
          </h1>
          <FallbackContainer>
            <p>{!isConnected ? t('connectWallet') : unsupported ? t('notSupported') : t('sus')}</p>
          </FallbackContainer>
        </section>
      ) : (
        <CreateStream />
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
