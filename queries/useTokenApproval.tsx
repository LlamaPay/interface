import BigNumber from 'bignumber.js';
import { Contract, Signer } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ITransactionError, ITransactionSuccess } from '~/types';
import {
  checkHasApprovedEnough,
  checkHasApprovedEnoughMultiple,
  createERC20Contract,
  ICheckMultipleTokenAllowance,
  ICheckTokenAllowance,
} from '~/utils/tokenUtils';
import { erc20ABI, useProvider, useSigner } from 'wagmi';
import { Provider } from '~/utils/contract';

interface IUseApproveToken {
  tokenAddress: string;
  spenderAddress: string;
  amountToApprove: string;
}

interface IUseApproveMultipleTokens {
  tokenAndAmount: { [key: string]: string };
  spender: string;
}

interface IApproveToken extends IUseApproveToken {
  signer?: Signer | null;
}

interface IApproveMultipleTokens extends IUseApproveMultipleTokens {
  signer?: Signer | null;
}

type UseTokenForMaxAmt = Omit<IUseApproveToken, 'amountToApprove'>;

type ApproveTokenForMaxAmt = Omit<IApproveToken, 'amountToApprove'>;

const maxAmount = new BigNumber(2).pow(256).minus(1).toFixed(0);

const checkApproval = async (data: ICheckTokenAllowance) => {
  try {
    const { res, err } = await checkHasApprovedEnough(data);
    if (err) {
      return false;
    } else return res;
  } catch (error) {
    return false;
  }
};

const checkMultipleApproval = async (data: ICheckMultipleTokenAllowance) => {
  try {
    const { allApproved, res, err } = await checkHasApprovedEnoughMultiple(data);
    if (err) return null;
    return { allApproved, res };
  } catch (error) {
    return null;
  }
};

const approveToken = async ({ tokenAddress, signer, amountToApprove, spenderAddress }: IApproveToken) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    } else {
      const contract = new Contract(getAddress(tokenAddress), erc20ABI, signer);
      const res = await contract.approve(getAddress(spenderAddress), amountToApprove);
      return await res.wait();
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't approve token"));
  }
};

const approveTokenForMaxAmt = async ({ tokenAddress, signer, spenderAddress }: ApproveTokenForMaxAmt) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    } else {
      const contract = new Contract(getAddress(tokenAddress), erc20ABI, signer);
      const res = await contract.approve(getAddress(spenderAddress), maxAmount);
      return await res.wait();
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't approve token"));
  }
};

export function useCheckTokenApproval() {
  return useMutation((data: ICheckTokenAllowance) => checkApproval(data));
}

export function useGetTokenApproval(data: ICheckTokenAllowance) {
  return useQuery(
    ['token-approval', data.approveForAddress, data.approvedForAmount, data.userAddress, data.token?.address],
    () => checkApproval(data)
  );
}

const getApprovalAmount = async (data: ICheckTokenAllowance) => {
  return (await data.token?.allowance(data.userAddress, data.approveForAddress)) as any;
};

export function useGetTokenApprovalRaw(data: Omit<ICheckTokenAllowance, 'approvedForAmount'>) {
  return useQuery(['token-approval-raw', data.approveForAddress, data.userAddress, data.token?.address], () =>
    getApprovalAmount(data)
  );
}

const getTokensApprovalAmount = async ({
  approveForAddress,
  userAddress,
  tokens,
  provider,
}: {
  approveForAddress: string;
  userAddress: string;
  tokens: Array<string>;
  provider: Provider;
}) => {
  const res = await Promise.all(
    tokens.map((token) =>
      createERC20Contract({ tokenAddress: getAddress(token), provider }).allowance(userAddress, approveForAddress)
    )
  );
  const data: Record<string, BigNumber> = {};
  tokens.forEach((token, i) => {
    data[token] = res[i];
  });
  return data;
};

export function useGetTokenApprovals({
  approveForAddress,
  userAddress,
  tokens,
}: {
  approveForAddress: string;
  userAddress: string;
  tokens: Array<string>;
}) {
  const provider = useProvider();
  return useQuery(['token-approvals', approveForAddress, userAddress, ...tokens], () =>
    getTokensApprovalAmount({ approveForAddress, userAddress, tokens, provider })
  );
}

export function useCheckMultipleTokenApproval() {
  return useMutation((data: ICheckMultipleTokenAllowance) => checkMultipleApproval(data));
}

export function useApproveToken() {
  const { data: signer } = useSigner();

  const queryClient = useQueryClient();

  return useMutation<ITransactionSuccess, ITransactionError, IApproveToken>(
    ({ tokenAddress, amountToApprove, spenderAddress }: IUseApproveToken) =>
      approveToken({ tokenAddress, signer, amountToApprove, spenderAddress }),
    {
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}

export function useApproveTokenForMaxAmt() {
  const { data: signer } = useSigner();

  const queryClient = useQueryClient();

  return useMutation<ITransactionSuccess, ITransactionError, UseTokenForMaxAmt>(
    ({ tokenAddress, spenderAddress }: UseTokenForMaxAmt) =>
      approveTokenForMaxAmt({ tokenAddress, signer, spenderAddress }),
    {
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
