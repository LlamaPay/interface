import { useQuery } from '@tanstack/react-query';
import { getAddress } from 'ethers/lib/utils';
import request, { gql } from 'graphql-request';
import { networkDetails } from '~/lib/networkDetails';
import { createContract } from '~/utils/contract';
import type { Provider } from '~/utils/contract';
import { getWithdrawableData } from '../useWithdrawable';
import BigNumber from 'bignumber.js';

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

async function fetchClaimableSalary({
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

    return withdrawableAmounts;
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch claimable salary"));
  }
}

export const useGetSalaryInfo = ({ userAddress, chainId }: { userAddress: string; chainId: number }) => {
  // get subgraph endpoint
  const endpoint = networkDetails[chainId]?.subgraphEndpoint;
  const provider = networkDetails[chainId]?.chainProviders;

  return useQuery<Array<IWithdrawableAmount>>(['salaryInfo', userAddress, chainId], () =>
    fetchClaimableSalary({ userAddress, endpoint, provider })
  );
};
