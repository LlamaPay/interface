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

interface INonRefundableContract {
  address: string;
  owner: {
    address: string;
  };
}

export interface ISubWithContractInfo extends ISub {
  nonRefundableContract: INonRefundableContract;
}

export interface ITier {
  id: string;
  token: IToken;
  costPerPeriod: string;
  amountOfSubs: string;
  disabledAt: string;
  tierId: string;
}

interface IRefundableContract {
  address: string;
  periodDuation: string;
  owner: {
    address: string;
  };
}

export interface ITierWithContractInfo extends ITier {
  refundableContract: IRefundableContract;
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

interface ISubscriptionContracts {
  refundables: Array<IRefundable>;
  nonrefundables: Array<INonRefundable>;
  nonRefundableSubs: Array<{ id: string }>;
}

export interface ISubscriptionContract {
  tier: ITierWithContractInfo | null;
  sub: ISubWithContractInfo | null;
}

export interface ISubberRefundable {
  expires: string;
  id: string;
  refundableContract: IRefundableContract;
  tier: ITier;
}

export interface ISubberNonRefundable {
  expires: string;
  id: string;
  sub: ISubWithContractInfo;
}

export interface ISubberSubscriptionContract {
  refundables: Array<ISubberRefundable>;
  nonrefundables: Array<ISubberNonRefundable>;
}

const fetchSubscriptionContracts = async ({
  userAddress,
  graphEndpoint,
}: {
  userAddress?: string;
  graphEndpoint?: string | null;
}): Promise<ISubscriptionContracts> => {
  try {
    if (!userAddress || !graphEndpoint) {
      return { refundables: [], nonrefundables: [], nonRefundableSubs: [] };
    }

    const res: { owner: ISubscriptionContracts; nonRefundableSubs: Array<{ id: string }> } = await request(
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

  return useQuery<ISubscriptionContracts>(
    ['subscriptionContracts', address, graphEndpoint],
    () => fetchSubscriptionContracts({ userAddress: address, graphEndpoint }),
    {
      refetchInterval: 30_000,
    }
  );
}

export async function fetchSubscriptionContract({
  graphEndpoint,
  contractId,
}: {
  graphEndpoint?: string | null;
  contractId?: string | null;
}): Promise<ISubscriptionContract> {
  if (!graphEndpoint || !contractId) {
    return { tier: null, sub: null };
  }

  try {
    const res = await request(
      graphEndpoint,
      gql`
        {
          tier (id: "${contractId.toLowerCase()}") {
            id
            costPerPeriod
            disabledAt
            token {
              symbol
              name
              decimals
              address
            }
            tierId
            refundableContract {
              address
              periodDuation
              owner {
                address
              }
            }
          }

          sub (id: "${contractId.toLowerCase()}") {
            id
            token {
              address
              decimals
              name
              symbol
            }
            subId
            disabled
            duration
            costOfSub
            nonRefundableContract {
              address
              owner {
                address
              }
            }
          }
        }
      `
    );

    return {
      tier: res.tier || null,
      sub: res.sub || null,
    };
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch details of this contract"));
  }
}

export function useGetSubscriptionContract({
  graphEndpoint,
  contractId,
}: {
  graphEndpoint?: string | null;
  contractId?: string | null;
}) {
  return useQuery<ISubscriptionContract>(
    ['subscriptionContract', contractId, graphEndpoint],
    () => fetchSubscriptionContract({ contractId, graphEndpoint }),
    {
      refetchInterval: 30_000,
    }
  );
}

async function fetchSubberSubscriptionContracts({
  userAddress,
  graphEndpoint,
}: {
  userAddress?: string | null;
  graphEndpoint?: string | null;
}) {
  try {
    if (!userAddress || !graphEndpoint) {
      return { refundables: [], nonrefundables: [] };
    }

    const res = await request(
      graphEndpoint,
      gql`
        {
          subber(id: "${userAddress.toLowerCase()}") {
            id
            nonRefundableSubs {
              expires
              id
              sub {
                costOfSub
                disabled
                duration
                subId
                token {
                  address
                  decimals
                  name
                  symbol
                }
                nonRefundableContract {
                  address
                  owner {
                    address
                  }
                }
              }
            }
            refundableSubs {
              expires
              id
              tier {
                amountOfSubs
                costPerPeriod
                disabledAt
                tierId
                token {
                  address
                  decimals
                  name
                  symbol
                }
              }
              refundableContract {
                address
                periodDuation
                owner {
                  address
                }
              }
            }
          }
        }
      `
    );

    return {
      refundables: res?.subber?.refundableSubs ?? [],
      nonrefundables: res?.subber?.nonRefundableSubs ?? [],
    };
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch subscription contracts"));
  }
}

export function useGetSubberSubscriptionContracts({ graphEndpoint }: { graphEndpoint?: string | null }) {
  const { address } = useAccount();

  return useQuery<ISubberSubscriptionContract>(
    ['subberSubscriptionContracts', address, graphEndpoint],
    () => fetchSubberSubscriptionContracts({ userAddress: address, graphEndpoint }),
    {
      refetchInterval: 30_000,
    }
  );
}
