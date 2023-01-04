import { useQuery } from 'react-query';
import { useAccount } from 'wagmi';
import { gql, request } from 'graphql-request';

export interface IScheduledTransferPayment {
  id: string;
  lastPaid: string;
  streamId: string;
  usdAmount: string;
  starts: string;
  redirects: string | null;
  frequency: string;
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
  history: Array<{ to: string }>;
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
  userAddress?: string;
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

    return (
      res.pools.map((pool) => ({
        ...pool,
        payments: pool.payments.filter((payment) => Number(payment.ends) * 1000 > Date.now()),
      })) ?? []
    );
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch scheduled transfers"));
  }
};

const fetchScheduledPayments = async ({
  userAddress,
  graphEndpoint,
}: {
  userAddress?: string;
  graphEndpoint?: string | null;
}) => {
  try {
    if (!userAddress || !graphEndpoint) {
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
            }
          }
        }
      `
    );

    return res.payments.filter((payment) => Number(payment.ends) * 1000 > Date.now()) ?? [];
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch scheduled payments"));
  }
};

const fetchScheduledTransfersHistory = async ({
  userAddress,
  graphEndpoint,
  isPoolOwnersHistory,
}: {
  userAddress?: string;
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

export function useGetScheduledTransferPools({ graphEndpoint }: { graphEndpoint?: string | null }) {
  const [{ data: accountData }] = useAccount();

  return useQuery<Array<IScheduledTransferPool>>(
    ['scheduledTransferPools', accountData?.address, graphEndpoint],
    () => fetchScheduledTransferPools({ userAddress: accountData?.address, graphEndpoint }),
    {
      refetchInterval: 30_000,
    }
  );
}

export function useGetScheduledPayments({ graphEndpoint }: { graphEndpoint?: string | null }) {
  const [{ data: accountData }] = useAccount();

  return useQuery<Array<IScheduledTransferPayment>>(
    ['scheduledPayments', accountData?.address, graphEndpoint],
    () => fetchScheduledPayments({ userAddress: accountData?.address, graphEndpoint }),
    {
      refetchInterval: 30_000,
    }
  );
}

export function useGetScheduledTransfersHistory({
  graphEndpoint,
  isPoolOwnersHistory,
}: {
  graphEndpoint?: string | null;
  isPoolOwnersHistory?: boolean;
}) {
  const [{ data: accountData }] = useAccount();

  return useQuery<Array<IScheduledTransferHistory>>(
    ['scheduledTransfersHistory', accountData?.address, graphEndpoint, isPoolOwnersHistory],
    () => fetchScheduledTransfersHistory({ userAddress: accountData?.address, graphEndpoint, isPoolOwnersHistory }),
    {
      refetchInterval: 30_000,
    }
  );
}
