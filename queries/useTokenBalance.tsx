import { useQuery } from 'react-query';
import { IToken } from 'types';
import { useAccount } from 'wagmi';
import BigNumber from 'bignumber.js';
import { useNetworkProvider } from 'hooks';
import { Provider } from 'utils/contract';

const fetchBalance = async (userAddress: string, token: IToken | null, provider: Provider | null) => {
  if (!userAddress || userAddress === '' || !token || !provider) return null;

  try {
    const res = await token.tokenContract.balanceOf(userAddress);
    const bal = new BigNumber(res.toString()).dividedBy(10 ** token.decimals);
    return bal ? bal.toFixed(5) : null;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

function useTokenBalance(token: IToken | null) {
  const [{ data: accountData }] = useAccount();
  const { provider } = useNetworkProvider();

  const userAddress = accountData?.address.toLowerCase() ?? '';

  return useQuery<string | null>(['balance', userAddress, token?.tokenAddress], () =>
    fetchBalance(userAddress, token, provider)
  );
}

export default useTokenBalance;
