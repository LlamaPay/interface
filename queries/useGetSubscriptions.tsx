import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { gql, request } from 'graphql-request';

interface ISub {
  costOfSub: string;
  disabled: boolean;
  duration: string;
  token: { address: string; name: string; symbol: string; decimals: number };
  id: string;
}

export interface IRefundable {
  address: string;
  id: string;
  periodDuation: string;
  whitelist: [];
}

export interface INonRefundable {
  address: string;
  id: string;
  subs: Array<ISub>;
  whitelist: [];
}

interface ISubscriptioncontracts {
  refundables: Array<IRefundable>;
  nonrefundables: Array<INonRefundable>;
}

const fetchSubscriptionContracts = async ({
  userAddress,
  graphEndpoint,
}: {
  userAddress?: string;
  graphEndpoint?: string | null;
}) => {
  try {
    if (!userAddress || !graphEndpoint) {
      return { refundables: [], nonrefundables: [] };
    }

    const res: { owner: ISubscriptioncontracts } = await request(
      graphEndpoint,
      gql`
        {
          owner(id: "${userAddress.toLowerCase()}") {
            id
            nonrefundables {
              id
              address
              subs {
                costOfSub
                disabled
                duration
                id
                token {
                  address
                  decimals
                  id
                  name
                  symbol
                }
              }
              whitelist
            }
            refundables {
              periodDuation
              id
              address
              whitelist
              tiers {
                amountOfSubs
                costPerPeriod
                disabledAt
                token {
                  address
                  decimals
                  name
                  symbol
                  id
                }
              }
            }
          }
        }
      `
    );

    return {
      refundables: res?.owner?.refundables ?? [],
      nonrefundables: res?.owner?.nonrefundables ?? [],
    };
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch subscription contracts"));
  }
};

export function useGetSubscriptionContracts({ graphEndpoint }: { graphEndpoint?: string | null }) {
  const { address } = useAccount();

  return useQuery<ISubscriptioncontracts>(
    ['subscriptionContracts', address, graphEndpoint],
    () => fetchSubscriptionContracts({ userAddress: address, graphEndpoint }),
    {
      refetchInterval: 30_000,
    }
  );
}
