import { Signer } from 'ethers';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ITransactionError, ITransactionSuccess } from '~/types';
import { createWriteContract } from '~/utils/contract';
import { useSigner } from 'wagmi';

interface IUseWithdrawPayerToken {
  llamaContractAddress: string;
  amountToWithdraw?: string;
  withdrawAll?: boolean;
}

interface IWithdrawPayerToken extends IUseWithdrawPayerToken {
  signer?: Signer | null;
}

const withdrawPayer = async ({ signer, llamaContractAddress, amountToWithdraw, withdrawAll }: IWithdrawPayerToken) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    } else {
      const contract = createWriteContract(llamaContractAddress, signer);
      if (withdrawAll) {
        return await contract.withdrawPayerAll();
      } else {
        return await contract.withdrawPayer(amountToWithdraw);
      }
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't withdraw token"));
  }
};

export default function useWithdrawByPayer() {
  const { data: signer } = useSigner();

  const queryClient = useQueryClient();

  return useMutation<ITransactionSuccess, ITransactionError, IUseWithdrawPayerToken, unknown>(
    ({ llamaContractAddress, amountToWithdraw, withdrawAll }: IUseWithdrawPayerToken) =>
      withdrawPayer({ signer, llamaContractAddress, amountToWithdraw, withdrawAll }),

    {
      onSuccess: (data) => {
        const toastId = toast.loading('Confirming Withdrawal');
        data.wait().then((res) => {
          toast.dismiss(toastId);
          queryClient.invalidateQueries();
          if (res.status === 1) {
            toast.success('Withdraw Success');
          } else {
            toast.error('Withdraw Failed');
          }
        });
      },
      onError: (error) => {
        toast.error(error.message || "Couldn't withdraw token");
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
