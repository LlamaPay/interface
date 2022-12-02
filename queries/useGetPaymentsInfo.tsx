import { useNetworkProvider } from 'hooks';
import { useQuery } from 'react-query';
import { useAccount } from 'wagmi';
import { gql, request } from 'graphql-request';
import { networkDetails } from 'utils/constants';
import { IPayments } from 'types';

async function getPaymentsInfo(userAddress: string | undefined, chainId: number | null) {
  try {
    if (!userAddress) throw new Error('No Account');
    if (!chainId) throw new Error('No Chain ID');
    if (!networkDetails[chainId].paymentsGraphApi || !networkDetails[chainId].paymentsContract)
      throw new Error('No Payments contract or api');
    const query = gql`
        {
          escrows(where: { payer: "${userAddress}" }) {
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
    const escrows = (await request(networkDetails[chainId].paymentsGraphApi!, query)).escrows;
    const results: IPayments[] = [];
    escrows.forEach((escrow: any) => {
      results.push({
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
