import { useNetworkProvider } from '~/hooks';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { gql, request } from 'graphql-request';
import { networkDetails } from '~/lib/networkDetails';
import type { IPayments } from '~/types';

async function getPaymentsInfo(userAddress: string | undefined, chainId: number | null) {
  try {
    if (!userAddress) throw new Error('No Account');
    if (!chainId) throw new Error('No Chain ID');
    if (!networkDetails[chainId].paymentsGraphApi || !networkDetails[chainId].paymentsContract)
      throw new Error('No Payments contract or api');
    const queryFrom = gql`
        {
          escrows(where: { payer: "${userAddress}" }) {
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
          escrows(where: { payee: "${userAddress}" }) {
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
    const froms = (await request(networkDetails[chainId].paymentsGraphApi!, queryFrom)).escrows;
    const tos = (await request(networkDetails[chainId].paymentsGraphApi!, queryTo)).escrows;
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

export default function useGetPaymentsInfo() {
  const { chainId } = useNetworkProvider();
  const [{ data: accountData }] = useAccount();
  return useQuery(['paymentsInfo', accountData?.address.toLowerCase(), chainId], () =>
    getPaymentsInfo(accountData?.address.toLowerCase(), chainId)
  );
}
