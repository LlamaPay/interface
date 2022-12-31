import { Signer } from 'ethers';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import type { ITransactionError, ITransactionSuccess } from '~/types';
import { createWriteContract } from '~/utils/contract';
import { useSigner } from 'wagmi';

interface IUseDepositToken {
  llamaContractAddress: string;
  amountToDeposit: string;
}

interface IDepositToken extends IUseDepositToken {
  signer?: Signer;
}

const deposit = async ({ signer, llamaContractAddress, amountToDeposit }: IDepositToken) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    } else {
      const contract = createWriteContract(llamaContractAddress, signer);
      return await contract.deposit(amountToDeposit);
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't deposit token"));
  }
};

export default function useDepositToken() {
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();

  return useMutation<ITransactionSuccess, ITransactionError, IUseDepositToken, unknown>(
    ({ llamaContractAddress, amountToDeposit }: IUseDepositToken) =>
      deposit({ signer, llamaContractAddress, amountToDeposit }),
    {
      onError: (error) => {
        toast.error(error.message || "Couldn't deposit token");
      },
      onSuccess: (data) => {
        const toastId = toast.loading('Confirming Deposit');
        data.wait().then((res) => {
          toast.dismiss(toastId);

          queryClient.invalidateQueries();

          if (res.status === 1) {
            toast.success('Deposit Success');
          } else {
            toast.error('Deposit Failed');
          }
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
