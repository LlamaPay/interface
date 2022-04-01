import { Signer } from 'ethers';
import { useMutation } from 'react-query';
import { createWriteContract } from 'utils/contract';
import { useSigner } from 'wagmi';

interface IUseWithdrawPayerToken {
  llamaContractAddress: string;
  amountToWithdraw: string;
  withdrawAll: boolean;
}

interface IWithdrawPayerToken extends IUseWithdrawPayerToken {
  signer?: Signer;
}

const withdrawPayer = async ({ signer, llamaContractAddress, amountToWithdraw, withdrawAll }: IWithdrawPayerToken) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    } else {
      const contract = createWriteContract(llamaContractAddress, signer);
      if (withdrawAll) {
        await contract.withdrawPayerAll();
      } else {
        await contract.withdrawPayer(amountToWithdraw);
      }
    }
  } catch (error: any) {
    throw new Error(error?.reason ?? "Couldn't withdraw token");
  }
};

export default function useWithdrawByPayer() {
  const [{ data: signer }] = useSigner();

  // TODO Invalidate all queries like balances etc onSuccess
  return useMutation(({ llamaContractAddress, amountToWithdraw, withdrawAll }: IUseWithdrawPayerToken) =>
    withdrawPayer({ signer, llamaContractAddress, amountToWithdraw, withdrawAll })
  );
}
