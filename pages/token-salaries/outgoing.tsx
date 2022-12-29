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
            ) : data.length === 1 ? (
              <p>
                Create a <Link href="/token-salaries/create">contract</Link> to schedule transfers
              </p>
            ) : null}
          </FallbackContainer>
        ) : (
          <>
            {data.map((pool) => (
              <table key={pool.poolContract} className="border-collapse [&:not(:first-of-type)]:mt-4">
                <tbody>
                  <tr>
                    <th className="whitespace-nowrap border py-[6px] px-4 text-left text-sm font-semibold text-lp-gray-4 dark:text-white">
                      Pool
                    </th>
                    <td className="table-description border border-solid">
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
                    <th className="whitespace-nowrap border py-[6px] px-4 text-left text-sm font-semibold text-lp-gray-4 dark:text-white">
                      Token
                    </th>
                    <td className="table-description border border-solid">
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
                    <th className="whitespace-nowrap border py-[6px] px-4 text-left text-sm font-semibold text-lp-gray-4 dark:text-white">
                      Oracle
                    </th>
                    <td className="table-description border border-solid">
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
                    <th className="whitespace-nowrap border py-[6px] px-4 text-left text-sm font-semibold text-lp-gray-4 dark:text-white">
                      Max Price
                    </th>
                    <td className="table-description border border-solid">
                      {pool.maxPrice && pool.token.decimals
                        ? `${(pool.maxPrice / 10 ** pool.token.decimals).toFixed(2)} ${pool.token.symbol}`
                        : ''}
                    </td>
                  </tr>
                  <tr>
                    <th className="whitespace-nowrap border py-[6px] px-4 text-left text-sm font-semibold text-lp-gray-4 dark:text-white">
                      Payments
                    </th>
                    <td className="overflow-x-auto border border-solid">
                      <table className="w-full table-auto border-collapse">
                        <thead>
                          <tr>
                            <th className="whitespace-nowrap border py-[6px] px-4 text-center text-sm font-normal text-lp-gray-4 dark:text-white">
                              Payee
                            </th>
                            <th className="whitespace-nowrap border py-[6px] px-4 text-center text-sm font-normal text-lp-gray-4 dark:text-white">
                              Start
                            </th>
                            <th className="whitespace-nowrap border py-[6px] px-4 text-center text-sm font-normal text-lp-gray-4 dark:text-white">
                              End
                            </th>
                            <th className="whitespace-nowrap border py-[6px] px-4 text-center text-sm font-normal text-lp-gray-4 dark:text-white">
                              Amount USD
                            </th>
                            <th className="whitespace-nowrap border py-[6px] px-4 text-center text-sm font-normal text-lp-gray-4 dark:text-white">
                              Redirects
                            </th>
                            <th className="whitespace-nowrap border py-[6px] px-4 text-center text-sm font-normal text-lp-gray-4 dark:text-white">
                              Frequency
                            </th>
                          </tr>
                        </thead>
                        <tbody className="border">
                          {pool.payments.map((payment) => (
                            <tr key={payment.id} className="border">
                              <td className="table-description border border-solid text-center">
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
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            ))}
          </>
        )}
      </div>
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

export default Home;
