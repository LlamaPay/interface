import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import { dehydrate, QueryClient } from 'react-query';
import { chainDetails } from 'utils/network';
import { useStreamByIdQuery } from 'services/generated/graphql';
import { BalanceIcon } from 'components/Icons';
import defaultImage from 'public/empty-token.webp';
import Image, { StaticImageData } from 'next/image';
import { useIntl, useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import { FallbackContainer } from 'components/Fallback';
import { BeatLoader } from 'react-spinners';
import { useGetEns } from 'queries/useResolveEns';
import Tooltip from 'components/Tooltip';
import { CurrencyDollarIcon } from '@heroicons/react/outline';
import { secondsByDuration } from 'utils/constants';
import { Push, TotalStreamed, Withdrawable } from 'components/Stream/Table/CustomValues';
import { useNetworkProvider } from 'hooks';
import { formatStream } from 'hooks/useFormatStreamAndHistory';
import { useNetwork } from 'wagmi';
import { WalletSelector } from 'components/Web3';
import { useDialogState } from 'ariakit';

interface ClaimPageProps {
  streamId: string;
  network: string | null;
  subgraphEndpoint: string;
  logoURI: StaticImageData;
  chainExplorer: string | null;
  chainId: number | null;
}

const Claim: NextPage<ClaimPageProps> = ({ subgraphEndpoint, streamId, network, logoURI, chainExplorer, chainId }) => {
  const [{ data: networkData }, switchNetwork] = useNetwork();

  const { data, isLoading, isError } = useStreamByIdQuery(
    {
      endpoint: subgraphEndpoint,
    },
    {
      id: streamId,
      network: network || 'noNetwork',
    },
    {
      refetchInterval: network ? 20000 : false,
    }
  );

  const { query } = useRouter();

  const t0 = useTranslations('Common');
  const t1 = useTranslations('Streams');

  const stream = data && (data.streams[0] || null);

  const showFallback = !network || isLoading || isError || !stream;

  const { provider } = useNetworkProvider();

  const formattedStream = stream && provider && formatStream({ stream, address: stream.payee.id, provider });

  const { data: payeeEns } = useGetEns(stream?.payee?.id ?? '');

  const amountPerMonth = stream ? (Number(stream.amountPerSec) * secondsByDuration['month']) / 1e20 : null;

  const intl = useIntl();

  const walletDailog = useDialogState();

  return (
    <Layout className="mt-12 flex w-full flex-col gap-[30px] dark:bg-[#161818]">
      <section className="app-section mx-auto w-full max-w-3xl">
        <h1 className="font-exo pb-1 text-3xl">Salary</h1>
        {!showFallback && (
          <div className="flex items-center gap-[0.675rem] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F] dark:bg-[#202020] dark:text-white">
            <p className="relative flex items-center gap-[0.675rem]">
              <span className="absolute">
                <Tooltip content="Payee Address">
                  <BalanceIcon />
                </Tooltip>
              </span>
              <a
                href={
                  chainExplorer
                    ? networkData.chain?.id === 82
                      ? `${chainExplorer}address/${stream?.payee?.id}`
                      : `${chainExplorer}/address/${stream?.payee?.id}`
                    : '/'
                }
                className="relative left-[30px]"
                target="_blank"
                rel="noopener noreferrer"
              >
                {payeeEns || stream?.payee?.id}
              </a>
            </p>
          </div>
        )}

        <div className="mt-[5px] mb-8 flex items-center gap-[0.675rem] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F] dark:bg-[#202020] dark:text-white">
          <div className="flex items-center rounded-full">
            <Image
              src={logoURI || defaultImage}
              alt={network ? t0('logoAlt', { name: network }) : 'Fallback Logo'}
              objectFit="contain"
              width="21px"
              height="24px"
            />
          </div>
          <p className="truncate whitespace-nowrap">{network || query.chain}</p>
        </div>

        {showFallback ? (
          <FallbackContainer>
            {!network ? (
              <p>{t0('networkNotSupported')}</p>
            ) : isLoading ? (
              <span className="relative top-[2px]">
                <BeatLoader size={6} />
              </span>
            ) : (
              <p>
                <span className="font-normal">Couldn't find any stream with ID: </span>
                {query.stream} <span className="font-normal">on</span> {network}
              </p>
            )}
          </FallbackContainer>
        ) : (
          <>
            <div className="mt-[-28px] flex items-center gap-[0.675rem] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F] dark:bg-[#202020] dark:text-white">
              <p className="flex items-center gap-[0.675rem]">
                <span className="relative top-[3px]">
                  <Tooltip content="Amount">
                    <CurrencyDollarIcon className="h-5 w-5" />
                  </Tooltip>
                </span>
                <span>{`${amountPerMonth && intl.formatNumber(amountPerMonth, { maximumFractionDigits: 5 })} ${
                  stream.token.symbol
                } / month`}</span>
              </p>
            </div>
            {formattedStream && (
              <>
                <h2 className="font-exo mt-8 text-lg text-[#4E575F] dark:text-[#9ca3af]">{t1('totalStreamed')}</h2>
                <span className="claim-amount">
                  <TotalStreamed data={formattedStream} />
                </span>
                <h2 className="font-exo mt-8 text-lg text-[#4E575F] dark:text-[#9ca3af]">{t1('withdrawable')}</h2>
                <span className="claim-amount">
                  <Withdrawable data={formattedStream} />
                </span>
                {!networkData.chain ? (
                  <button className="form-submit-button mt-8" onClick={walletDailog.toggle}>
                    {t0('connectWallet')}
                  </button>
                ) : chainId === networkData.chain?.id ? (
                  <span className="claim-button">
                    <Push data={formattedStream} buttonName="Withdraw" />
                  </span>
                ) : (
                  <button
                    className="form-submit-button mt-8"
                    disabled={!switchNetwork || chainId === null}
                    onClick={() => switchNetwork && chainId !== null && switchNetwork(chainId)}
                  >
                    Switch Network
                  </button>
                )}
              </>
            )}
          </>
        )}
      </section>
      <WalletSelector dialog={walletDailog} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const { chain, stream } = query;

  const id = typeof stream === 'string' ? stream : null;

  if (!chain || !stream || !id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { network, chain: c } = chainDetails(chain);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    'StreamById',
    useStreamByIdQuery.fetcher(
      {
        endpoint: network?.subgraphEndpoint ?? '',
      },
      {
        id: id ?? '',
        network: c?.name ?? '',
      }
    )
  );

  // Pass data to the page via props
  return {
    props: {
      streamId: id,
      network: c?.name ?? null,
      chainId: c?.id ?? null,
      chainExplorer: c?.blockExplorers ? c.blockExplorers[0].url : null,
      subgraphEndpoint: network?.subgraphEndpoint ?? '',
      logoURI: network?.logoURI ?? defaultImage,
      dehydratedState: dehydrate(queryClient),
      messages: (await import(`translations/${locale}.json`)).default,
    },
  };
};

export default Claim;
