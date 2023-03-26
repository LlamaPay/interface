import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import BigNumber from 'bignumber.js';
import { networkDetails } from '~/lib/networkDetails';

export interface IScheduledTransferPayment {
  id: string;
  lastPaid: string;
  streamId: string;
  usdAmount: string;
  starts: string;
  redirects: string | null;
  frequency: string;
  usdPerSec: string;
  ends: string;
  pool: {
    owner: string;
    poolContract: string;
    token: {
      name: string;
      address: string;
      symbol: string;
    };
  };
  history: Array<{ to: string; createdTimestamp: string; usdAmount: string }>;
  chainId: number;
}

export interface IScheduledTransferPool {
  poolContract: string;
  oracle: string;
  maxPrice: number | null;
  token: {
    address: string;
    decimals: number | null;
    name: string | null;
    symbol: string | null;
  };
  payments: Array<IScheduledTransferPayment>;
}

export interface IScheduledTransferHistory {
  to: string | null;
  txHash: string;
  usdAmount: string | null;
  eventType: string;
  createdTimestamp: string;
  pool: {
    owner: string;
  };
}

const fetchScheduledTransferPools = async ({
  userAddress,
  graphEndpoint,
}: {
  userAddress?: string | null;
  graphEndpoint?: string | null;
}) => {
  try {
    if (!userAddress || !graphEndpoint) {
      return [];
    }

    const res: { pools: Array<IScheduledTransferPool> } = await request(
      graphEndpoint,
      gql`
        {
          pools (where: { owner: "${userAddress}" }) {
            poolContract
            oracle
            maxPrice
            token {
              address
              decimals
              symbol
              name
            }
            payments {
              id
              lastPaid
              streamId
              usdAmount
              starts
              redirects
              frequency
              ends
              pool {
                owner
                poolContract
              }
              history {
                to
              }
            }
          }
        }
      `
    );
    const filtered =
      res.pools.map((pool) => ({
        ...pool,
        payments: pool.payments.filter((payment) => Number(payment.ends) * 1000 > Date.now()),
      })) ?? [];
    filtered.forEach((o) => {
      o.payments.forEach((i) => {
        i.usdPerSec = BigNumber(i.usdAmount).div(i.frequency).toString();
      });
    });
    return filtered;
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch scheduled transfers"));
  }
};

const fetchScheduledPayments = async ({
  userAddress,
  graphEndpoint,
  chainId,
}: {
  userAddress?: string | null;
  graphEndpoint?: string | null;
  chainId?: number | null;
}) => {
  try {
    if (!userAddress || !graphEndpoint || !chainId) {
      return [];
    }

    const res: { payments: Array<IScheduledTransferPayment> } = await request(
      graphEndpoint,
      gql`
        {
          payments (where: { history_: { to: "${userAddress}" }}) {
            id
            lastPaid
            streamId
            usdAmount
            starts
            redirects
            frequency
            ends
            pool {
              owner
              poolContract
              token {
                name
                address
                symbol
              }
            }
            history {
              to
              createdTimestamp
              usdAmount
            }
          }
        }
      `
    );

    const filtered = (res.payments.filter((payment) => Number(payment.ends) * 1000 > Date.now()) ?? []).map((item) => ({
      ...item,
      usdPerSec: BigNumber(item.usdAmount).div(item.frequency).toString(),
      chainId,
    }));

    return filtered;
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch scheduled payments"));
  }
};

const fetchScheduledTransfersHistory = async ({
  userAddress,
  graphEndpoint,
  isPoolOwnersHistory,
}: {
  userAddress?: string | null;
  graphEndpoint?: string | null;
  isPoolOwnersHistory?: boolean;
}) => {
  try {
    if (!userAddress || !graphEndpoint) {
      return [];
    }

    const res: { historyEvents: Array<IScheduledTransferHistory> } = await request(
      graphEndpoint,
      isPoolOwnersHistory
        ? gql`
            {
              historyEvents(orderBy: createdTimestamp, orderDirection: desc, where: { pool_: { owner: "${userAddress}" } }) {
                to
                txHash
                usdAmount
                eventType
                createdTimestamp
                pool {
                  owner
                }
              }
            }
          `
        : gql`
            {
              historyEvents(orderBy: createdTimestamp, orderDirection: desc, where: { to: "${userAddress}" }) {
                to
                txHash
                usdAmount
                eventType
                createdTimestamp
                pool {
                  owner
                }
              }
            }
          `
    );

    return res.historyEvents ?? [];
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch history"));
  }
};

export function useGetScheduledTransferPools({
  userAddress,
  chainId,
}: {
  userAddress?: string | null;
  chainId?: number | null;
}) {
  const graphEndpoint = chainId ? networkDetails[chainId]?.scheduledTransferSubgraph : null;

  return useQuery<Array<IScheduledTransferPool>>(
    ['scheduledTransferPools', userAddress, graphEndpoint],
    () => fetchScheduledTransferPools({ userAddress, graphEndpoint }),
    {
      refetchInterval: 30_000,
    }
  );
}

export function useGetScheduledPayments({
  userAddress,
  chainId,
}: {
  userAddress?: string | null;
  chainId?: number | null;
}) {
  // get subgraph endpoint
  const graphEndpoint = chainId ? networkDetails[chainId]?.scheduledTransferSubgraph : null;

  return useQuery<Array<IScheduledTransferPayment>>(
    ['scheduledPayments', userAddress, graphEndpoint],
    () => fetchScheduledPayments({ userAddress, graphEndpoint, chainId }),
    {
      refetchInterval: 30_000,
    }
  );
}

async function fetchScheduledPaymentsOnAllChains({ userAddress }: { userAddress?: string | null }) {
  const chains = Object.entries(networkDetails).map(([chainId, data]) => ({
    endpoint: data.scheduledTransferSubgraph,
    chainId: Number(chainId),
  }));

  try {
    const data = await Promise.allSettled(
      chains.map(({ chainId, endpoint }) => fetchScheduledPayments({ userAddress, graphEndpoint: endpoint, chainId }))
    );

    return data.reduce((acc, curr) => {
      if (curr.status === 'fulfilled') {
        acc = [...acc, ...(curr.value || [])];
      }
      return acc;
    }, [] as Array<IScheduledTransferPayment>);
  } catch (error: any) {
    console.log("Couldn't fetch scheduled payments on all chains");
    console.log(error);
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch scheduled payments on all chains"));
  }
}

export function useGetScheduledPaymentsOnAllChains({ userAddress }: { userAddress?: string | null }) {
  return useQuery<Array<IScheduledTransferPayment>>(
    ['scheduledPaymentsOnAllChains', userAddress],
    () => fetchScheduledPaymentsOnAllChains({ userAddress }),
    {
      refetchInterval: 30_000,
    }
  );
}

export function useGetScheduledTransfersHistory({
  userAddress,
  chainId,
  isPoolOwnersHistory,
}: {
  userAddress?: string | null;
  chainId?: number | null;
  isPoolOwnersHistory?: boolean;
}) {
  const graphEndpoint = chainId ? networkDetails[chainId]?.scheduledTransferSubgraph : null;

  return useQuery<Array<IScheduledTransferHistory>>(
    ['scheduledTransfersHistory', userAddress, graphEndpoint, isPoolOwnersHistory],
    () => fetchScheduledTransfersHistory({ userAddress, graphEndpoint, isPoolOwnersHistory }),
    {
      refetchInterval: 30_000,
    }
  );
}
