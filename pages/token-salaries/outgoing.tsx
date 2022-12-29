import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import { useAccount, useNetwork } from 'wagmi';
import { networkDetails } from 'lib/networkDetails';
import { useGetScheduledTransfers } from 'queries/useGetScheduledTransfers';
import { FallbackContainer, FallbackContainerLoader } from 'components/Fallback';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { formatAddress } from 'utils/address';

const Home: NextPage = () => {
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }] = useNetwork();

  const explorerUrl = networkData?.chain?.id ? networkDetails[networkData.chain.id]?.blockExplorerURL : null;

  const graphEndpoint = networkData?.chain?.id ? networkDetails[networkData.chain.id]?.scheduledTransferSubgraph : null;

  const { data, isLoading, isError } = useGetScheduledTransfers({ graphEndpoint });

  const t0 = useTranslations('Common');

  const showFallback =
    !accountData ||
    !networkData ||
    networkData.chain?.unsupported ||
    isLoading ||
    isError ||
    !data ||
    data.length === 0;

  return (
    <Layout className="flex flex-col gap-12">
      <div>
        <h1 className="font-exo section-header">Your Contracts</h1>
        {showFallback ? (
          <FallbackContainer>
            {!accountData ? (
              <p>{t0('connectWallet')}</p>
            ) : !graphEndpoint || networkData?.chain?.unsupported ? (
              <p>{t0('networkNotSupported')}</p>
            ) : isLoading ? (
              <FallbackContainerLoader />
            ) : isError || !data ? (
              <p>{t0('error')}</p>
            ) : data.length === 0 ? (
              <p>
                Create a{' '}
                <Link href="/token-salaries/create" passHref>
                  <a className="underline">contract</a>
                </Link>{' '}
                to schedule transfers
              </p>
            ) : null}
          </FallbackContainer>
        ) : (
          <>
            {data.map((pool) => (
              <div
                key={pool.poolContract}
                className="max-w-[calc(100vw-32px)] overflow-x-auto md:max-w-[calc(100vw-48px)] lg:max-w-[calc(100vw-256px)] [&:not(:first-of-type)]:mt-4"
              >
                <table className="border-collapse text-lp-gray-4 dark:text-white">
                  <tbody>
                    <tr>
                      <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-left text-sm font-semibold dark:border-lp-gray-7">
                        Pool
                      </th>
                      <td className="table-description border border-solid border-llama-teal-2 text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                        {explorerUrl ? (
                          <a
                            href={`${explorerUrl}/address/${pool.poolContract}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {pool.poolContract}
                          </a>
                        ) : (
                          pool.poolContract
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-left text-sm font-semibold dark:border-lp-gray-7">
                        Token
                      </th>
                      <td className="table-description border border-solid border-llama-teal-2 text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                        {explorerUrl ? (
                          <a
                            href={`${explorerUrl}/address/${pool.token.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {`${pool.token.name || pool.token.address}`}
                          </a>
                        ) : (
                          <>{`${pool.token.name || pool.token.address}`}</>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-left text-sm font-semibold dark:border-lp-gray-7">
                        Oracle
                      </th>
                      <td className="table-description border border-solid border-llama-teal-2 text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                        {explorerUrl ? (
                          <a href={`${explorerUrl}/address/${pool.oracle}`} target="_blank" rel="noopener noreferrer">
                            {pool.oracle}
                          </a>
                        ) : (
                          <>{pool.oracle}</>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-left text-sm font-semibold dark:border-lp-gray-7">
                        Max Price
                      </th>
                      <td className="table-description border border-solid border-llama-teal-2 text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                        {pool.maxPrice && pool.token.decimals
                          ? `${(pool.maxPrice / 10 ** pool.token.decimals).toFixed(2)} ${pool.token.symbol}`
                          : ''}
                      </td>
                    </tr>
                    <tr>
                      <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-left text-sm font-semibold dark:border-lp-gray-7">
                        Payments
                      </th>
                      <td className="overflow-x-auto border border-solid border-llama-teal-2 text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                                Payee
                              </th>
                              <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                                Start
                              </th>
                              <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                                End
                              </th>
                              <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                                Amount USD
                              </th>
                              <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                                Redirects
                              </th>
                              <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                                Frequency
                              </th>
                            </tr>
                          </thead>
                          <tbody className="border border-llama-teal-2 dark:border-lp-gray-7">
                            {pool.payments.map((payment) => (
                              <tr key={payment.id}>
                                <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                                  {explorerUrl ? (
                                    <a
                                      href={`${explorerUrl}/address/${payment.payee}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {formatAddress(payment.payee)}
                                    </a>
                                  ) : (
                                    <>{formatAddress(payment.payee)}</>
                                  )}
                                </td>
                                <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                                  {payment.starts
                                    ? new Date(Number(payment.starts) * 1000).toLocaleDateString() +
                                      ', ' +
                                      new Date(Number(payment.starts) * 1000).toLocaleTimeString()
                                    : ''}
                                </td>
                                <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                                  {payment.ends
                                    ? new Date(Number(payment.ends) * 1000).toLocaleDateString() +
                                      ', ' +
                                      new Date(Number(payment.ends) * 1000).toLocaleTimeString()
                                    : ''}
                                </td>
                                <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                                  {payment.usdAmount
                                    ? '$' +
                                      (Number(payment.usdAmount) / 1e18).toLocaleString(undefined, {
                                        maximumFractionDigits: 2,
                                      })
                                    : ''}
                                </td>
                                <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                                  {payment.redirects}
                                </td>
                                <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                                  {formatFrequency(payment.frequency)}
                                </td>
                              </tr>
                            ))}
                            <tr>
                              {pool.payments.length === 0 && (
                                <td
                                  className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white"
                                  colSpan={6}
                                >
                                  Schedule a Payment
                                </td>
                              )}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </>
        )}
      </div>
    </Layout>
  );
};

const formatFrequency = (frequency: string) => {
  const days = Number(frequency) / (24 * 3600);

  if (days < 1) {
    const hours = Number(frequency) / 3600;

    if (hours < 1) {
      const minutes = Number(frequency) / 60;

      return (
        minutes.toLocaleString(undefined, {
          maximumFractionDigits: 4,
        }) +
        ' minute' +
        (minutes !== 1 ? 's' : '')
      );
    }

    return (
      hours.toLocaleString(undefined, {
        maximumFractionDigits: 4,
      }) +
      ' hour' +
      (hours !== 1 ? 's' : '')
    );
  }

  return (
    days.toLocaleString(undefined, {
      maximumFractionDigits: 4,
    }) +
    ' day' +
    (days !== 1 ? 's' : '')
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

export default Home;
