import { useQuery } from '@tanstack/react-query';
import { gql, request } from 'graphql-request';
import { networkDetails } from '~/lib/networkDetails';
import type { IPayments } from '~/types';

async function getPaymentsInfo({
  userAddress,
  chainId,
  endpoint,
}: {
  userAddress?: string | null;
  chainId: number | null;
  endpoint?: string | null;
}) {
  try {
    if (!userAddress) {
      throw new Error('No Account');
    }

    if (!chainId) {
      throw new Error('No Chain ID');
    }

    if (!endpoint) {
      throw new Error('No Payments contract or api');
    }

    const queryFrom = gql`
        {
          escrows(where: { payer: "${userAddress.toLowerCase()}" }) {
            id
            token {
                name
                symbol
                address
                decimals
            }
            payer
            payee
            amount
            release
            active
            revoked
          }
        }
      `;

    const queryTo = gql`
        {
          escrows(where: { payee: "${userAddress.toLowerCase()}" }) {
            id
            token {
                name
                symbol
                address
                decimals
            }
            payer
            payee
            amount
            release
            active
            revoked
          }
        }
      `;

    const froms = (await request(endpoint, queryFrom)).escrows;
    const tos = (await request(endpoint, queryTo)).escrows;

    const results: IPayments[] = [];
    const ids: string[] = [];
    const escrows = froms.concat(tos);

    escrows.forEach((escrow: any) => {
      if (!ids.includes(escrow.id)) {
        results.push({
          id: escrow.id,
          tokenName: escrow.token.name,
          tokenSymbol: escrow.token.symbol,
          tokenAddress: escrow.token.address,
          tokenDecimals: Number(escrow.token.decimals),
          payer: escrow.payer,
          payee: escrow.payee,
          amount: Number(escrow.amount),
          release: Number(escrow.release),
          active: escrow.active,
          revoked: escrow.revoked,
        });
        ids.push(escrow.id);
      }
    });

    return results;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const useGetPaymentsInfo = ({ userAddress, chainId }: { userAddress: string; chainId: number }) => {
  // get subgraph endpoint
  const endpoint = networkDetails[chainId]?.paymentsGraphApi;

  return useQuery(['paymentsInfo', userAddress, chainId], () => getPaymentsInfo({ userAddress, chainId, endpoint }));
};
