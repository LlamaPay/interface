import { Signer } from 'ethers';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { createWriteContract } from 'utils/contract';
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

  // TODO Invalidate all queries like balances etc onSuccess
  return useMutation(
    ({ llamaContractAddress, amountToDeposit }: IUseDepositToken) =>
      deposit({ signer, llamaContractAddress, amountToDeposit }),
    {
      onError: (error: any) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        const toastId = toast.loading('Confirming deposit');
        data.wait().then((res: any) => {
          toast.dismiss(toastId);
          if (res.status === 1) {
            toast.success('Deposited Successfully');
          } else {
            toast.error('Deposit failed');
          }
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
