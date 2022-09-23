import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { dehydrate, QueryClient } from 'react-query';
import { useDialogState } from 'ariakit';
import { useNetwork } from 'wagmi';
import { useIntl, useTranslations } from 'next-intl';
import { BeatLoader } from 'react-spinners';
import Layout from 'components/Layout';
import { FallbackContainer } from 'components/Fallback';
import Tooltip from 'components/Tooltip';
import { Push, TotalStreamed, Withdrawable } from 'components/Stream/Table/CustomValues';
import { WalletSelector } from 'components/Web3';
import { StreamIcon } from 'components/Icons';
import { useNetworkProvider, useTokenList } from 'hooks';
import { formatStream } from 'hooks/useFormatStreamAndHistory';
import { useGetEns } from 'queries/useResolveEns';
import { chainDetails } from 'utils/network';
import { secondsByDuration } from 'utils/constants';
import { useStreamByIdQuery } from 'services/generated/graphql';
import defaultImage from 'public/empty-token.webp';

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

  const { data: tokenList } = useTokenList();

  const { data, isLoading, isError } = useStreamByIdQuery(
    {
      endpoint: subgraphEndpoint,
    },
    {
      id: streamId,
      network: network || 'noNetwork',
    },
    {
      refetchInterval: network ? 30000 : false,
    }
  );

  const { query } = useRouter();

  const t0 = useTranslations('Common');
  const t1 = useTranslations('Streams');

  const stream = data && (data.streams[0] || null);

  const showFallback = !network || isLoading || isError || !stream;

  const { provider } = useNetworkProvider();

  const salaryData = stream && provider && formatStream({ stream, address: stream.payee.id, provider });

  const { data: payeeEns } = useGetEns(stream?.payee?.id ?? '');
  const { data: payerEns } = useGetEns(stream?.payer?.id ?? '');

  const amountPerMonth = stream ? (Number(stream.amountPerSec) * secondsByDuration['month']) / 1e20 : null;

  const intl = useIntl();

  const walletDailog = useDialogState();

  const tokenLogo = tokenList?.find(
    (t) => t.tokenAddress.toLowerCase() === stream?.token?.address?.toLowerCase()
  )?.logoURI;

  const addTokenToWallet = () => {
    if (typeof window !== 'undefined' && window.ethereum && stream?.token?.symbol) {
      window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: stream?.token.address, // The address that the token is at.
            symbol: stream?.token.symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: stream.token.decimals, // The number of decimals in the token
            image: tokenLogo, // A string url of the token logo
          },
        },
      });
    }
  };

  return (
    <Layout className="mt-12 flex w-full flex-col gap-[30px] dark:bg-lp-gray-8">
      <section className="mx-auto w-full max-w-lg px-2">
        <h1 className="font-exo pb-1 text-3xl">Salary</h1>
        {!showFallback && (
          <>
            <div className="flex items-center gap-[0.675rem] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F] dark:bg-[#202020] dark:text-white">
              <p className="relative flex items-center gap-[10px]">
                <span>From</span>
                <a
                  href={
                    chainExplorer
                      ? networkData.chain?.id === 82 || networkData.chain?.id === 1088
                        ? `${chainExplorer}address/${stream?.payer?.id}`
                        : `${chainExplorer}/address/${stream?.payer?.id}`
                      : '/'
                  }
                  className="relative break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {payerEns || stream?.payer?.id}
                </a>
              </p>
            </div>
            <div className="mt-[5px] flex items-center gap-[0.675rem] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F] dark:bg-[#202020] dark:text-white">
              <p className="relative flex items-center gap-[10px]">
                <span>To</span>
                <a
                  href={
                    chainExplorer
                      ? networkData.chain?.id === 82 || networkData.chain?.id === 1088
                        ? `${chainExplorer}address/${stream?.payee?.id}`
                        : `${chainExplorer}/address/${stream?.payee?.id}`
                      : '/'
                  }
                  className="relative break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {payeeEns || stream?.payee?.id}
                </a>
              </p>
            </div>
          </>
        )}

        <div className="mt-[5px] mb-8 flex items-center gap-[10px] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F] dark:bg-[#202020] dark:text-white">
          <Tooltip content="Chain">
            <div className="flex items-center rounded-full">
              <Image
                src={logoURI || defaultImage}
                alt={network ? t0('logoAlt', { name: network }) : 'Chain'}
                objectFit="contain"
                width="16px"
                height="15px"
              />
            </div>
          </Tooltip>
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
            <div className="mt-[-28px] flex items-center gap-[10px] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F] dark:bg-[#202020] dark:text-white">
              <div className="flex items-center rounded-full">
                <Image
                  src={tokenLogo || defaultImage}
                  alt={stream.token.name || 'Token'}
                  objectFit="contain"
                  width="16px"
                  height="16px"
                />
              </div>
              <p>
                {`${amountPerMonth && intl.formatNumber(amountPerMonth, { maximumFractionDigits: 5 })} ${
                  stream.token.symbol
                } / month`}
              </p>
            </div>

            <div className="mt-[5px] flex items-center gap-[10px] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F] dark:bg-[#202020] dark:text-white">
              <span className="relative top-[3px]">
                <Tooltip content={t0('amount')}>
                  <StreamIcon height={15} width={16} />
                </Tooltip>
              </span>
              <Link href={`/salaries/${network || query.chain}/${payeeEns || stream?.payee?.id}`}>
                Checkout all streams
              </Link>
            </div>

            {/* TODO add translations */}
            {salaryData && (
              <>
                <h2 className="font-exo mt-8 text-lg text-[#4E575F] dark:text-[#9ca3af]">{t1('totalStreamed')}</h2>
                <span className="claim-amount">
                  <TotalStreamed data={salaryData} />
                </span>
                <h2 className="font-exo mt-8 text-lg text-[#4E575F] dark:text-[#9ca3af]">{t1('withdrawable')}</h2>
                <span className="claim-amount">
                  <Withdrawable data={salaryData} />
                </span>

                {/* 
                   Ask user to connect wallet before withdrawing
                */}
                {!networkData.chain ? (
                  <button className="form-submit-button mt-8" onClick={walletDailog.toggle}>
                    {t0('connectWallet')}
                  </button>
                ) : chainId !== networkData.chain?.id ? (
                  // Check if user is on same network with the chain on which salary is streaming
                  // else switch to the right network
                  <button
                    className="form-submit-button mt-8"
                    disabled={!switchNetwork || chainId === null}
                    onClick={() => switchNetwork && chainId !== null && switchNetwork(chainId)}
                  >
                    Switch Network
                  </button>
                ) : (
                  <>
                    <Push
                      data={salaryData}
                      buttonName="Withdraw"
                      className="mt-8 w-full border border-transparent py-[7px] px-3 text-base !font-semibold"
                    />

                    <button
                      type="button"
                      className="form-submit-button mt-4 flex flex-1 items-center justify-center gap-[4px] rounded-[10px] bg-lp-white font-normal text-lp-primary dark:bg-lp-gray-5 dark:text-lp-white"
                      disabled={typeof window === 'undefined' || !window.ethereum}
                      onClick={addTokenToWallet}
                    >
                      <span>Add</span>
                      <Image
                        src={tokenLogo || defaultImage}
                        alt={stream.token.name || 'Token'}
                        objectFit="contain"
                        width="16px"
                        height="16px"
                      />
                      <span>{`${stream.token.symbol} to wallet`}</span>
                    </button>
                  </>
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
