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
  nonRefundableSubs: Array<{ id: string }>;
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
  disabledAt: string;
  tierId: string;
  refundableSubs: Array<{ id: string }>;
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
  owner: {
    address: string;
  };
}

export interface INonRefundable {
  address: string;
  id: string;
  subs: Array<ISub>;
  whitelist: [];
  owner: {
    address: string;
  };
}

interface ISubscriptionContracts {
  refundables: Array<IRefundable>;
  nonRefundables: Array<INonRefundable>;
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
  tokenId: string;
}

export interface ISubberNonRefundable {
  expires: string;
  id: string;
  sub: ISubWithContractInfo;
  tokenId: string;
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
      return { refundables: [], nonRefundables: [] };
    }

    const res: {
      refundables: Array<IRefundable>;
      nonRefundables: Array<INonRefundable>;
    } = await request(
      graphEndpoint,
      gql`
        {
          nonRefundables(where: {or: [{whitelist_contains: ["${userAddress.toLowerCase()}"]}, {owner: "${userAddress.toLowerCase()}"}]}) {
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
              nonRefundableSubs(where: {expires_gt: "${Math.floor(Date.now() / 1000)}"}) {
                id
              }
            }
            whitelist
            owner {
              address
            }
          }
          refundables(where: {or: [{whitelist_contains: ["${userAddress.toLowerCase()}"]}, {owner: "${userAddress.toLowerCase()}"}]}) {
            id
            address
            periodDuation
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
              disabledAt
              tierId
              refundableSubs(where: {expires_gt: "${Math.floor(Date.now() / 1000)}"}) {
                id
              }
            }
            whitelist
            owner {
              address
            }
          }
        }
      `
    );

    return {
      refundables: res?.refundables ?? [],
      nonRefundables: res?.nonRefundables ?? [],
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
            nonRefundableSubs(where: {expires_gt: "${Math.floor(Date.now() / 1000)}"}) {
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
              tokenId
            }
            refundableSubs(where: {expires_gt: "${Math.floor(Date.now() / 1000)}"}) {
              expires
              id
              tier {
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
              tokenId
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
