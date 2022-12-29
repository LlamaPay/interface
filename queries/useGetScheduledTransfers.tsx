import { useQuery } from 'react-query';
import { useAccount } from 'wagmi';
import { gql, request } from 'graphql-request';

interface IScheduledTransferContract {
  poolContract: string;
  oracle: string;
  maxPrice: number | null;
  token: {
    address: string;
    decimals: number | null;
    name: string | null;
    symbol: string | null;
  };
  payments: Array<{
    payee: string;
    id: string;
    lastPaid: string;
    streamId: string;
    usdAmount: string;
    starts: string;
    redirects: string | null;
    frequency: string;
    ends: string;
  }>;
}

const fetchScheduledTransfers = async ({
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

export function useGetScheduledTransfers({ graphEndpoint }: { graphEndpoint?: string | null }) {
  const [{ data: accountData }] = useAccount();

  return useQuery<Array<IScheduledTransferContract>>(
    ['scheduledTransfers', accountData?.address, graphEndpoint],
    () => fetchScheduledTransfers({ userAddress: accountData?.address, graphEndpoint }),
    {
      refetchInterval: 30_000,
    }
  );
}
