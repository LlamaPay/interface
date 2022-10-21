import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import { useAccount } from 'wagmi';
import { useChainExplorer, useFormatStreamAndHistory, useGraphEndpoint, useNetworkProvider } from 'hooks';
import { useTranslations } from 'next-intl';
import { BalanceIcon, StreamIcon } from 'components/Icons';
import { InputText, SubmitButton } from 'components/Form';
import { useStreamAndHistoryQuery } from 'services/generated/graphql';
import { BeatLoader } from 'react-spinners';
import {
  AmtPerMonth,
  amtPerMonthFormatter,
  Push,
  SavedName,
  StreamAddress,
  streamAddressFormatter,
  TokenName,
  Withdrawable,
} from 'components/Stream/Table/CustomValues';
import { CashIcon } from '@heroicons/react/solid';
import useBatchCalls from 'queries/useBatchCalls';
import useGnosisBatch from 'queries/useGnosisBatch';
import { LlamaContractInterface } from 'utils/contract';
import { chainDetails } from 'utils/network';
import defaultImage from 'public/empty-token.webp';
import Image from 'next/image';
import { networkDetails } from 'utils/constants';
import { useRouter } from 'next/router';
import { FallbackContainer } from 'components/Fallback';

interface ICall {
  [key: string]: string[];
}

interface IWithdrawProps {
  resolvedAddress: string | null;
}

const Withdraw: NextPage<IWithdrawProps> = ({ resolvedAddress }) => {
  const [{ data: accountData }] = useAccount();
  const { unsupported } = useNetworkProvider();
  const [addressToFetch, setAddressToFetch] = React.useState<string | null>(resolvedAddress);
  const [fetchingEns, setFetchingEns] = React.useState(false);
  const { mutate: batchCall } = useBatchCalls();
  const { mutate: gnosisBatch } = useGnosisBatch();
  const { url: chainExplorer } = useChainExplorer();

  const router = useRouter();

  const { address } = router.query;

  const { provider, network, chainId } = useNetworkProvider();

  const { network: mainnet } = chainDetails('1');

  const { logoURI } = chainId ? networkDetails[chainId] : { logoURI: null };

  // get subgraph endpoint
  const endpoint = useGraphEndpoint();

  const { data, isLoading, isError } = useStreamAndHistoryQuery(
    {
      endpoint,
    },
    {
      id: addressToFetch?.toLowerCase() ?? '',
      network: network || '',
    },
    {
      refetchInterval: 30000,
    }
  );

  const t0 = useTranslations('Withdraw');
  const t1 = useTranslations('Streams');
  const t2 = useTranslations('Common');

  const fetchStreams = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFetchingEns(true);

    const form = e.target as HTMLFormElement & { addressToFetchStreams: { value: string } };

    try {
      const userAddress = await mainnet?.chainProviders
        .resolveName(form.addressToFetchStreams.value)
        .then((address) => address || form.addressToFetchStreams.value)
        .catch(() => form.addressToFetchStreams.value);

      setAddressToFetch(userAddress || form.addressToFetchStreams.value);
    } catch (error) {
      setAddressToFetch(form.addressToFetchStreams.value);
    } finally {
      router.push(`/withdraw?address=${form.addressToFetchStreams.value}`, undefined, { shallow: true });
      setFetchingEns(false);
      form.reset();
    }
  };

  const formattedData = useFormatStreamAndHistory({
    data,
    address: addressToFetch || undefined,
    provider,
  });

  const sendAllOnClick = () => {
    const calls: ICall =
      formattedData.streams?.reduce((acc: ICall, current) => {
        const callData = acc[current.llamaContractAddress] ?? [];

        callData.push(
          LlamaContractInterface.encodeFunctionData('withdraw', [
            current.payerAddress,
            current.payeeAddress,
            current.amountPerSec,
          ])
        );

        return (acc = { ...acc, [current.llamaContractAddress]: callData });
      }, {}) ?? {};

    if (process.env.NEXT_PUBLIC_SAFE === 'true') {
      gnosisBatch({ calls: calls });
    } else {
      Object.keys(calls).map((p) => {
        batchCall({ llamaContractAddress: p, calls: calls[p] });
      });
    }
  };

  const showFallback = !accountData || unsupported;

  const t = useTranslations('Common');

  return (
    <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center pb-8 dark:bg-lp-gray-8">
      <section className="z-2 mx-auto flex w-full max-w-lg flex-col gap-5">
        <h1 className="font-exo flex items-center gap-[0.625rem] text-2xl font-semibold text-lp-gray-4">
          <StreamIcon />
          <span className="dark:text-white">Withdraw on Behalf of Another Wallet</span>
        </h1>

        <div className="mt-[-15px] flex items-center gap-[0.675rem] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F] dark:bg-[#202020] dark:text-white">
          <div className="flex items-center rounded-full">
            <Image
              src={logoURI ?? defaultImage}
              alt={t('logoAlt', { name: network })}
              objectFit="contain"
              width="21px"
              height="24px"
            />
          </div>
          <p className="truncate whitespace-nowrap">{network}</p>
        </div>

        {showFallback ? (
          <FallbackContainer>
            <p>{!accountData ? t0('connectWallet') : unsupported ? t0('networkNotSupported') : t0('sus')}</p>
          </FallbackContainer>
        ) : (
          <form onSubmit={fetchStreams}>
            <InputText label={t0('addressToFetchStreams')} name="addressToFetchStreams" isRequired />
            <SubmitButton className="mt-5" disabled={isLoading}>
              {fetchingEns || isLoading ? <BeatLoader size={6} color="white" /> : 'Fetch Streams'}
            </SubmitButton>
          </form>
        )}
      </section>

      {!showFallback && addressToFetch && !isLoading && (
        <section className="mt-20">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex flex-wrap items-center gap-[0.625rem] text-lp-gray-4">
              <BalanceIcon />
              <span>
                <span className="dark:text-white">Streams of</span>{' '}
                <a
                  href={
                    chainId === 82 || chainId === 1088
                      ? `${chainExplorer}address/${addressToFetch}`
                      : `${chainExplorer}/address/${addressToFetch}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-words break-all font-medium dark:text-white"
                >
                  {address}
                </a>
              </span>
            </h2>

            <button
              onClick={sendAllOnClick}
              disabled={!accountData || unsupported || isError || !formattedData.streams}
              className="secondary-button flex w-fit items-center justify-between gap-4 whitespace-nowrap py-2 px-8 text-sm font-bold disabled:cursor-not-allowed dark:border-lp-secondary dark:bg-lp-primary dark:text-white"
            >
              <span>{t0('sendAll')}</span>
              <CashIcon className="h-4 w-4" />
            </button>
          </div>

          {isError || !formattedData.streams ? (
            <FallbackContainer>
              <p>{!formattedData.streams ? t0('noData') : isError ? t0('error') : t0('sus')}</p>
            </FallbackContainer>
          ) : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th className="whitespace-nowrap border py-[6px] px-4 text-left text-sm font-semibold text-lp-gray-4 dark:text-white">
                      {t2('name')}
                    </th>
                    <th className="whitespace-nowrap border py-[6px] px-4 text-left text-sm font-semibold text-lp-gray-4 dark:text-white">
                      {t2('address')}
                    </th>
                    <th className="whitespace-nowrap border py-[6px] px-4 text-left text-sm font-semibold text-lp-gray-4 dark:text-white">
                      {t2('token')}
                    </th>
                    <th className="whitespace-nowrap border py-[6px] px-4 text-left text-sm font-semibold text-lp-gray-4 dark:text-white">
                      {t2('amount')}
                    </th>
                    <th className="whitespace-nowrap border py-[6px] px-4 text-left text-sm font-semibold text-lp-gray-4 dark:text-white">
                      {t1('withdrawable')}
                    </th>
                    <th className="whitespace-nowrap border py-[6px] px-4 text-left text-sm font-semibold text-lp-gray-4 dark:text-white"></th>
                  </tr>
                </thead>
                <tbody>
                  {formattedData.streams.map((stream) => (
                    <tr key={stream.streamId} className="border dark:border-white">
                      <td className="table-description border-solid dark:border-white">
                        <SavedName data={stream} />
                      </td>
                      <td className="table-description border-solid dark:border-white">
                        <StreamAddress data={streamAddressFormatter(stream)} />
                      </td>
                      <td className="table-description border-solid dark:border-white">
                        <TokenName data={stream} />
                      </td>
                      <td className="table-description border-solid dark:border-white">
                        <AmtPerMonth data={stream.amountPerSec} />
                      </td>
                      <td className="table-description border-solid dark:border-white">
                        <Withdrawable data={stream} />
                      </td>
                      <td className="table-description border-solid text-right dark:border-white">
                        <Push data={stream} buttonName="Send" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const { address } = query;

  const { network: mainnet } = chainDetails('1');

  const defaultAddress = typeof address === 'string' ? address : null;

  const resolvedAddress = await mainnet?.chainProviders
    .resolveName(defaultAddress || '')
    .then((address) => address || defaultAddress)
    .catch(() => defaultAddress);

  // Pass data to the page via props
  return {
    props: {
      messages: (await import(`translations/${locale}.json`)).default,
      resolvedAddress,
    },
  };
};

export default Withdraw;
