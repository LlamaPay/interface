import { useQuery } from '@tanstack/react-query';
import { getAddress } from 'ethers/lib/utils';
import request, { gql } from 'graphql-request';
import { networkDetails } from '~/lib/networkDetails';
import { createContract } from '~/utils/contract';
import type { Provider } from '~/utils/contract';
import { getWithdrawableData } from '../useWithdrawable';
import BigNumber from 'bignumber.js';
import { fetchTokenPrice } from '../useTokenPrice';

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
  amountPerSec: string;
}

interface IWithdrawable {
  withdrawableAmount: BigNumber;
  owed: BigNumber;
  lastUpdate: BigNumber;
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

interface IClaimableSalary {
  withdrawables: Array<IWithdrawableAmount>;
  tokenPrices: { [token: string]: number | null };
}

async function fetchClaimableSalary({
  userAddress,
  endpoint,
  provider,
  prefix,
}: {
  userAddress: string;
  endpoint?: string;
  provider?: Provider;
  prefix?: string;
}) {
  try {
    if (!endpoint || !provider) return { withdrawables: [], tokenPrices: {} };

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
              amountPerSec
            }
          }
        }
      `
    );

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
    const uniqueTokens = new Set<string>();

    salaryStreams?.user?.streams.forEach((stream: IStream, index: number) => {
      const wData = withdrawables[index];

      if (wData && wData.status === 'fulfilled') {
        uniqueTokens.add(stream.token.address);

        withdrawableAmounts.push({
          amountPerSec: stream.amountPerSec,
          token: stream.token,
          withdrawableAmount: wData.value.withdrawableAmount,
          owed: wData.value.owed,
          lastUpdate: wData.value.lastUpdate,
        });
      }
    });

    const prices = await Promise.allSettled(Array.from(uniqueTokens).map((token) => fetchTokenPrice(token, prefix)));

    const tokenPrices: { [token: string]: number | null } = {};

    Array.from(uniqueTokens).forEach((token, index) => {
      const data = prices[index];
      tokenPrices[token] = null;

      if (data.status === 'fulfilled' && data.value) {
        tokenPrices[token] = data.value;
      }
    });

    return { withdrawables: withdrawableAmounts, tokenPrices };
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch claimable salary"));
  }
}

export const useClaimableSalary = ({ userAddress, chainId }: { userAddress: string; chainId: number }) => {
  // get subgraph endpoint
  const endpoint = networkDetails[chainId]?.subgraphEndpoint;
  const provider = networkDetails[chainId]?.chainProviders;
  const prefix = networkDetails[chainId]?.prefix;

  return useQuery<IClaimableSalary>(['claimableSalary', userAddress, chainId], () =>
    fetchClaimableSalary({ userAddress, endpoint, provider, prefix })
  );
};
