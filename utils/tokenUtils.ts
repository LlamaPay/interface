import { Contract } from 'ethers';
import { erc20ABI } from 'wagmi';
import { Provider } from './contract';

// Creates an instance of an ERC20 contract
export const createERC20Contract = ({
  tokenAddress,
  provider,
}: {
  tokenAddress: string;
  provider: Provider;
}): Contract => {
  return new Contract(tokenAddress, erc20ABI, provider);
};

interface ICheckTokenResponse {
  res: boolean;
  err: string | null;
}

export interface ICheckTokenAllowance {
  token?: Contract;
  userAddress?: string;
  approveForAddress?: string;
  approvedForAmount?: string;
}

// Checks if user has approved this token
export const checkHasApprovedEnough = async ({
  token,
  userAddress,
  approveForAddress,
  approvedForAmount,
}: ICheckTokenAllowance): Promise<ICheckTokenResponse> => {
  try {
    if (!userAddress || !token || !approveForAddress || !approvedForAmount) {
      throw new Error('Invalid arguments');
    }
    const res = (await token.allowance(userAddress, approveForAddress)).gte(approvedForAmount);
    return { res, err: null };
  } catch (err) {
    // console.log(err);
    return { res: false, err: 'Something went wrong' };
  }
};
