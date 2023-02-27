import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { gql, request } from 'graphql-request';

interface IToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface ISub {
  costOfSub: string;
  disabled: boolean;
  duration: string;
  token: IToken;
  id: string;
  subId: string;
}

interface ITier {
  id: string;
  token: IToken;
  costPerPeriod: string;
  amountOfSubs: string;
  disabledAt: string;
  tierid: string;
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
  nonRefundableSubs: Array<{ id: string }>;
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
      return { refundables: [], nonrefundables: [], nonRefundableSubs: [] };
    }

    const res: { owner: ISubscriptioncontracts; nonRefundableSubs: Array<{ id: string }> } = await request(
      graphEndpoint,
      gql`
        {
          nonRefundableSubs(where: {expires_gte: "${Math.floor(
            Date.now() / 1000
          )}", nonRefundableContract_: {owner: "${userAddress.toLowerCase()}"}}) {
            id
          }
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
                subId
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
                amountOfSubs
                costPerPeriod
                disabledAt
                tierId
              }
            }
          }
        }
      `
    );

    return {
      refundables: res?.owner?.refundables ?? [],
      nonrefundables: res?.owner?.nonrefundables ?? [],
      nonRefundableSubs: res?.nonRefundableSubs ?? [],
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
