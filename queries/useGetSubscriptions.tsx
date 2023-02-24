import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { gql, request } from 'graphql-request';

interface IToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

interface ISub {
  costOfSub: string;
  disabled: boolean;
  duration: string;
  token: IToken;
  id: string;
}

interface ITier {
  id: string;
  token: IToken;
  costPerPeriod: string;
  amountOfSubs: string;
  disabledAt: string;
}

export interface IRefundable {
  address: string;
  id: string;
  periodDuation: string;
  whitelist: [];
  tiers: Array<ITier>;
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
                id
                token {
                  address
                  decimals
                  id
                  name
                  symbol
                }
                costPerPeriod
                amountOfSubs
                disabledAt
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
