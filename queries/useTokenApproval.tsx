import BigNumber from 'bignumber.js';
import { Contract, Signer } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { useMutation } from 'react-query';
import { checkHasApprovedEnough, ICheckTokenAllowance } from 'utils/tokenUtils';
import { erc20ABI, useSigner } from 'wagmi';

interface IUseApproveToken {
  tokenAddress: string;
  spenderAddress: string;
  amountToApprove: string;
}

interface IApproveToken extends IUseApproveToken {
  signer?: Signer;
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
    throw new Error(error?.reason ?? "Couldn't approve token");
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
    throw new Error(error?.reason ?? "Couldn't approve token");
  }
};

export function useCheckTokenApproval() {
  return useMutation((data: ICheckTokenAllowance) => checkApproval(data));
}

export function useApproveToken() {
  const [{ data: signer }] = useSigner();

  return useMutation(({ tokenAddress, amountToApprove, spenderAddress }: IUseApproveToken) =>
    approveToken({ tokenAddress, signer, amountToApprove, spenderAddress })
  );
}

export function useApproveTokenForMaxAmt() {
  const [{ data: signer }] = useSigner();

  return useMutation(({ tokenAddress, spenderAddress }: UseTokenForMaxAmt) =>
    approveTokenForMaxAmt({ tokenAddress, signer, spenderAddress })
  );
}
