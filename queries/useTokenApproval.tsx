import { Contract, Signer } from 'ethers';
import { useMutation } from 'react-query';
import { checkHasApprovedEnough, ICheckTokenAllowance } from 'utils/tokenUtils';
import { erc20ABI, useSigner } from 'wagmi';

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

interface IUseApproveToken {
  tokenAddress: string;
  spenderAddress: string;
  amountToApprove: string;
}

interface IApproveToken extends IUseApproveToken {
  signer?: Signer;
}

const approveToken = async ({ tokenAddress, signer, amountToApprove, spenderAddress }: IApproveToken) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    } else {
      const contract = new Contract(tokenAddress, erc20ABI, signer);
      await contract.approve(spenderAddress, amountToApprove);
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
