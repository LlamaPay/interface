import { useQuery } from '@tanstack/react-query';
import { getAddress } from 'ethers/lib/utils';
import { GraphQLClient, gql, request } from 'graphql-request';
import { networkDetails } from '~/lib/networkDetails';
import { createContract } from '~/utils/contract';
import type { Provider } from '~/utils/contract';
import { getWithdrawableData } from '../useWithdrawable';
import BigNumber from 'bignumber.js';
import { formatStream } from '~/hooks/useFormatStreamAndHistory';
import type { IFormattedSalaryStream } from '~/types';

export interface ISalaryStream {
  streamId: string;
  contract: {
    address: string;
  };
  payer: {
    id: string;
  };
  payee: {
    id: string;
  };
  token: {
    address: string;
    name: string;
    decimals: number;
    symbol: string;
  };
  historicalEvents: Array<{
    eventType: string;
    txHash: string;
    createdTimestamp: string;
  }>;
  active: boolean;
  reason: string | null;
  paused: boolean;
  pausedAmount: string | null;
  lastPaused: string;
  amountPerSec: string;
  createdTimestamp: string;
}

interface IWithdrawable {
  withdrawableAmount: BigNumber;
  owed: BigNumber;
  lastUpdate: BigNumber;
  payerAddress: string;
  payeeAddress: string;
  contract: string;
}

interface IWithdrawableAmount extends IWithdrawable {
  amountPerSec: string;
  token: {
    address: string;
    name: string;
    decimals: number;
    symbol: string;
  };
  chainId: number;
}

interface ISalaryInfo {
  withdrawableAmounts: Array<IWithdrawableAmount>;
  salaryStreams: Array<IFormattedSalaryStream>;
}

interface IHistoryResponse {
  amount: string;
  createdTimestamp: string;
  eventType: string;
  oldStream: {
    amountPerSec: string;
    createdTimestamp: string;
    payee: { id: string };
    payer: { id: string };
    streamId: string;
    token: {
      address: string;
      decimals: number;
      name: string;
      symbol: string;
    };
  } | null;
  stream: {
    amountPerSec: string;
    createdTimestamp: string;
    payee: { id: string };
    payer: { id: string };
    streamId: string;
    token: {
      address: string;
      decimals: number;
      name: string;
      symbol: string;
    };
  } | null;
  token: { symbol: string; decimals: number };
  txHash: string;
  users: Array<{ id: string }>;
}

export interface ISalaryHistory extends IHistoryResponse {
  amountPerSec: string | null;
  addressRelated: string;
  addressRelatedEns: string | null;
  addressType: string;
}

async function fetchSalaryInfo({
  userAddress,
  endpoint,
  provider,
  chainId,
}: {
  userAddress?: string;
  endpoint?: string | null;
  provider?: Provider | null;
  chainId?: number;
}) {
  const controller = new AbortController();

  const timeoutID = setTimeout(() => {
    controller.abort();
    console.log(`Fetching salaries info on chain ${chainId} is timed out`);
  }, 5_000);

  try {
    if (!endpoint || !provider || !userAddress || !chainId)
      return { withdrawableAmounts: [], salaryStreams: [], chainId };

    const client = new GraphQLClient(endpoint, { signal: controller.signal as any });

    const salaryStreams = await client.request<{ user: { streams: Array<ISalaryStream> } }>(
      gql`
        {
          user(id: "${userAddress.toLowerCase()}") {
            streams(orderBy: createdTimestamp, orderDirection: desc, where: { active: true }) {
              streamId
              contract {
                address
              }
              payer {
                id
              }
              payee {
                id
              }
              token {
                address
                name
                decimals
                symbol
              }
              historicalEvents(orderBy: createdTimestamp, orderDirection: desc) {
                eventType
                txHash
                createdTimestamp
              }
              active
              reason
              paused
              pausedAmount
              lastPaused
              amountPerSec
              createdTimestamp
            }
          }
        }
      `
    );

    const withdrawables = await Promise.allSettled(
      salaryStreams?.user?.streams?.map((stream: ISalaryStream) =>
        getWithdrawableData({
          contract: createContract(getAddress(stream.contract.address), provider),
          payer: stream.payer.id,
          payee: stream.payee.id,
          amountPerSec: stream.amountPerSec,
        })
      ) ?? []
    );

    const withdrawableAmounts: Array<IWithdrawableAmount> = [];

    salaryStreams?.user?.streams?.forEach((stream: ISalaryStream, index: number) => {
      const wData = withdrawables[index];

      if (wData && wData.status === 'fulfilled') {
        withdrawableAmounts.push({
          amountPerSec: stream.amountPerSec,
          token: stream.token,
          withdrawableAmount: wData.value.withdrawableAmount,
          owed: wData.value.owed,
          lastUpdate: wData.value.lastUpdate,
          payerAddress: stream.payer.id,
          payeeAddress: stream.payee.id,
          contract: stream.contract.address,
          chainId,
        });
      } else {
        console.log(`Couldn't fetch withdrawable amounts of stream ${stream.streamId} on chain ${chainId}`);
      }
    });

    return {
      withdrawableAmounts,
      salaryStreams: salaryStreams?.user?.streams.map((s: ISalaryStream) =>
        formatStream({ stream: s, address: userAddress, provider, ensData: {}, chainId })
      ),
      chainId,
    };
  } catch (error: any) {
    console.log(`Couldn't fetch salary info on chain ${chainId}`);
    console.log(error);
    throw new Error(error.message || (error?.reason ?? `Couldn't fetch salary info on ${chainId}`));
  } finally {
    clearTimeout(timeoutID);
  }
}

export const useGetSalaryInfo = ({ userAddress, chainId }: { userAddress?: string; chainId?: number }) => {
  // get subgraph endpoint
  const endpoint = chainId ? networkDetails[chainId]?.subgraphEndpoint : null;
  const provider = chainId ? networkDetails[chainId]?.chainProviders : null;

  return useQuery<ISalaryInfo>(['salaryInfo', userAddress, chainId], () =>
    fetchSalaryInfo({ userAddress, endpoint, provider, chainId })
  );
};

async function fetchSalaryInfoOnAllChains({ userAddress }: { userAddress?: string }) {
  const chains = Object.entries(networkDetails).map(([chainId, data]) => ({
    endpoint: data.subgraphEndpoint,
    provider: data.chainProviders,
    chainId: Number(chainId),
  }));

  try {
    const data = await Promise.allSettled(
      chains.map(({ chainId, endpoint, provider }) => fetchSalaryInfo({ userAddress, endpoint, provider, chainId }))
    );

    return data.reduce(
      (acc, curr) => {
        if (curr.status === 'fulfilled') {
          acc.withdrawableAmounts = [...acc.withdrawableAmounts, ...(curr.value.withdrawableAmounts || [])];
          acc.salaryStreams = [...acc.salaryStreams, ...(curr.value.salaryStreams || [])];
        }
        return acc;
      },
      { withdrawableAmounts: [] as Array<IWithdrawableAmount>, salaryStreams: [] as Array<IFormattedSalaryStream> }
    );
  } catch (error: any) {
    console.log("Couldn't fetch salary info  on all chains");
    console.log(error);
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch salary info on all chains"));
  }
}

export const useGetSalaryInfoOnAllChains = ({ userAddress }: { userAddress?: string }) => {
  return useQuery<ISalaryInfo>(['salaryInfoOnAllChains', userAddress], () =>
    fetchSalaryInfoOnAllChains({ userAddress })
  );
};

async function fetchSalaryHistoryInfo({
  userAddress,
  endpoint,
  provider,
}: {
  userAddress: string;
  endpoint?: string;
  provider?: Provider;
}) {
  try {
    if (!endpoint || !provider) return [] as Array<ISalaryHistory>;

    const history = await request<{ user: { historicalEvents: Array<IHistoryResponse> } }>(
      endpoint,
      gql`
        {
          user(id: "${userAddress.toLowerCase()}") {
            historicalEvents(orderBy: createdTimestamp, orderDirection: desc, first: 1000) {
              txHash
              eventType
              users {
                id
              }
              stream {
                streamId
                payer {
                  id
                }
                payee {
                  id
                }
                token {
                  address
                  name
                  decimals
                  symbol
                }
                amountPerSec
                createdTimestamp
              }
              oldStream {
                streamId
                payer {
                  id
                }
                payee {
                  id
                }
                token {
                  address
                  symbol
                }
                amountPerSec
                createdTimestamp
              }
              token {
                symbol
                decimals
              }
              amount
              createdTimestamp
            }
          }
        }
      `
    );

    return (history?.user?.historicalEvents?.map((h: IHistoryResponse) => {
      const addressType: 'payer' | 'payee' =
        h.stream?.payer?.id?.toLowerCase() === userAddress.toLowerCase() ? 'payer' : 'payee';

      const addressRelated =
        addressType === 'payer'
          ? h.stream?.payee?.id ?? null
          : h.stream?.payer?.id
          ? h.stream?.payer?.id
          : h.users[0]?.id ?? null;

      // TODO fix ens names
      const ensName = null;

      return {
        ...h,
        amountPerSec: h.stream?.amountPerSec ?? null,
        addressRelated,
        addressRelatedEns: ensName,
        addressType,
      };
    }) ?? []) as Array<ISalaryHistory>;
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch salary history info"));
  }
}

export const useGetSalaryHistoryInfo = ({ userAddress, chainId }: { userAddress: string; chainId: number }) => {
  // get subgraph endpoint
  const endpoint = networkDetails[chainId]?.subgraphEndpoint;
  const provider = networkDetails[chainId]?.chainProviders;

  return useQuery<Array<ISalaryHistory>>(['salaryHistoryInfo', userAddress, chainId], () =>
    fetchSalaryHistoryInfo({ userAddress, endpoint, provider })
  );
};
