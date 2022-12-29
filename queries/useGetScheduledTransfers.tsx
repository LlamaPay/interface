import { useQuery } from 'react-query';
import { useAccount } from 'wagmi';
import { gql, request } from 'graphql-request';

export interface IScheduledTransferPayment {
  payee: string;
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
  };
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

    const res = await request(
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
              payee
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
            }
          }
        }
      `
    );

    return res.pools ?? [];
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

    const res = await request(
      graphEndpoint,
      gql`
        {
          payments (where: { payee: "${userAddress}" }) {
            payee
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
          }
        }
      `
    );

    return res.payments ?? [];
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch scheduled payments"));
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
