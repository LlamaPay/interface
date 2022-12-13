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

interface ICheckMultipleTokensResponse {
  allApproved: boolean;
  res: { [key: string]: boolean } | null;
  err: string | null;
}

export interface ICheckTokenAllowance {
  token?: Contract;
  userAddress?: string;
  approveForAddress?: string;
  approvedForAmount?: string;
}

export interface ICheckMultipleTokenAllowance {
  userAddress?: string;
  tokens: {
    [key: string]: {
      token: Contract;
      approveForAddress?: string;
      approvedForAmount?: string;
    };
  };
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

export const checkHasApprovedEnoughMultiple = async (
  data: ICheckMultipleTokenAllowance
): Promise<ICheckMultipleTokensResponse> => {
  try {
    if (!data.userAddress || !data.tokens) throw new Error('Invalid arguments');
    let res: { [key: string]: boolean } = {};
    let allApproved = true;
    for (const token in data.tokens) {
      const currToken = data.tokens[token];
      const result: boolean = (await currToken.token.allowance(data.userAddress, currToken.approveForAddress)).gte(
        currToken.approvedForAmount
      );
      if (!result) {
        allApproved = false;
      }
      res[token] = result;
    }
    return { allApproved, res, err: null };
  } catch (error) {
    return { allApproved: false, res: null, err: 'Something went wrong' };
  }
};
