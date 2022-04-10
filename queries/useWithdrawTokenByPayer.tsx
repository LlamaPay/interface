import { Signer } from 'ethers';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { createWriteContract } from 'utils/contract';
import { useSigner } from 'wagmi';

interface IUseWithdrawPayerToken {
  llamaContractAddress: string;
  amountToWithdraw?: string;
  withdrawAll?: boolean;
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
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();

  // TODO Invalidate all queries like balances etc onSuccess
  return useMutation(
    ({ llamaContractAddress, amountToWithdraw, withdrawAll }: IUseWithdrawPayerToken) =>
      withdrawPayer({ signer, llamaContractAddress, amountToWithdraw, withdrawAll }),

    {
      onSuccess: (data) => {
        const toastId = toast.loading('Confirming');
        data.wait().then((res: any) => {
          toast.dismiss(toastId);
          if (res.status === 1) {
            toast.success('Transaction Success');
          } else {
            toast.error('Transaction failed');
          }
        });
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
