import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import { CreateStream } from 'components/Stream';
import { useAccount } from 'wagmi';
import { useNetworkProvider } from 'hooks';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import { StreamIcon } from 'components/Icons';

const Create: NextPage = () => {
  const [{ data: accountData }] = useAccount();
  const { unsupported } = useNetworkProvider();

  // keep query active in this page so when a stream is submitted this query is invalidated and the data is present when user is navigated to homepage
  useStreamsAndHistory();

  return (
    <Layout className="mx-auto mt-12 flex w-full flex-col items-center space-y-6">
      {!accountData || unsupported ? (
        <section className="z-2 flex w-full max-w-lg flex-col">
          <h1 className="font-exo mb-5 flex items-center gap-[0.625rem] text-2xl font-semibold text-[#3D3D3D]">
            <StreamIcon />
            <span>Create a New Stream</span>
          </h1>
          <div className="flex h-14 w-full items-center justify-center rounded border border-dashed border-[#626262] text-xs font-semibold">
            <p>
              {!accountData
                ? 'Connect Wallet to Create a New Stream'
                : unsupported
                ? 'Chain not supported'
                : 'Something went wrong'}
            </p>
          </div>
        </section>
      ) : (
        <CreateStream />
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  // Pass data to the page via props
  return {
    props: {
      messages: (await import(`../translations/${locale}.json`)).default,
    },
  };
};

export default Create;
