import { useQuery } from '@tanstack/react-query';
import { getAddress } from 'ethers/lib/utils';
import request, { gql } from 'graphql-request';
import { networkDetails } from '~/lib/networkDetails';
import { createContract } from '~/utils/contract';
import type { Provider } from '~/utils/contract';
import { getWithdrawableData } from '../useWithdrawable';
import BigNumber from 'bignumber.js';
import { formatStream } from '~/hooks/useFormatStreamAndHistory';
import type { ISalaryStream } from '~/types';

interface IStream {
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
}

interface ISalaryInfo {
  withdrawableAmounts: Array<IWithdrawableAmount>;
  salaryStreams: Array<ISalaryStream>;
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

export interface IHistory extends IHistoryResponse {
  amountPerSec: string | null;
  addressRelated: string;
  addressRelatedEns: string | null;
  addressType: string;
}

async function fetchSalaryInfo({
  userAddress,
  endpoint,
  provider,
}: {
  userAddress: string;
  endpoint?: string;
  provider?: Provider;
}) {
  try {
    if (!endpoint || !provider) return { withdrawableAmounts: [], salaryStreams: [] };

    const salaryStreams = await request(
      endpoint,
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

    console.log({ salaryStreams });

    const withdrawables = await Promise.allSettled<IWithdrawable>(
      salaryStreams?.user?.streams.map((stream: IStream) =>
        getWithdrawableData({
          contract: createContract(getAddress(stream.contract.address), provider),
          payer: stream.payer.id,
          payee: stream.payee.id,
          amountPerSec: stream.amountPerSec,
        })
      ) ?? []
    );

    const withdrawableAmounts: Array<IWithdrawableAmount> = [];

    salaryStreams?.user?.streams.forEach((stream: IStream, index: number) => {
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
        });
      }
    });

    return {
      withdrawableAmounts,
      salaryStreams: salaryStreams?.user?.streams.map((s: IStream) =>
        formatStream({ stream: s, address: userAddress, provider, ensData: {} })
      ),
    };
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch salary info"));
  }
}

export const useGetSalaryInfo = ({ userAddress, chainId }: { userAddress: string; chainId: number }) => {
  // get subgraph endpoint
  const endpoint = networkDetails[chainId]?.subgraphEndpoint;
  const provider = networkDetails[chainId]?.chainProviders;

  return useQuery<ISalaryInfo>(['salaryInfo', userAddress, chainId], () =>
    fetchSalaryInfo({ userAddress, endpoint, provider })
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
    if (!endpoint || !provider) return [];

    const history = await request(
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

    return (
      history?.user?.historicalEvents?.map((h: IHistoryResponse) => {
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
      }) ?? []
    );
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch salary history info"));
  }
}

export const useGetSalaryHistoryInfo = ({ userAddress, chainId }: { userAddress: string; chainId: number }) => {
  // get subgraph endpoint
  const endpoint = networkDetails[chainId]?.subgraphEndpoint;
  const provider = networkDetails[chainId]?.chainProviders;

  return useQuery<Array<IHistory>>(['salaryHistoryInfo', userAddress, chainId], () =>
    fetchSalaryHistoryInfo({ userAddress, endpoint, provider })
  );
};
