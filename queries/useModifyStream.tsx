import { Signer } from 'ethers';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { ITransactionError, ITransactionSuccess } from 'types';
import { createWriteContract } from 'utils/contract';
import { useSigner } from 'wagmi';

interface IUseModifyStream {
  llamaContractAddress: string;
  payeeAddress: string;
  amountPerSec: string;
  updatedAddress: string;
  updatedAmountPerSec: string;
}

interface IModifyStream extends IUseModifyStream {
  signer?: Signer;
}

const modifyStream = async ({
  llamaContractAddress,
  payeeAddress,
  amountPerSec,
  updatedAddress,
  updatedAmountPerSec,
  signer,
}: IModifyStream) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    } else {
      const contract = createWriteContract(llamaContractAddress, signer);
      return await contract.modifyStream(payeeAddress, amountPerSec, updatedAddress, updatedAmountPerSec);
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't modify stream"));
  }
};

export default function useModifyStream() {
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();

  return useMutation<ITransactionSuccess, ITransactionError, IUseModifyStream, unknown>(
    ({ llamaContractAddress, payeeAddress, amountPerSec, updatedAddress, updatedAmountPerSec }: IUseModifyStream) =>
      modifyStream({ llamaContractAddress, payeeAddress, amountPerSec, updatedAddress, updatedAmountPerSec, signer }),
    {
      onSuccess: (data) => {
        const toastId = toast.loading('Confirming transaction');
        data.wait().then((res) => {
          toast.dismiss(toastId);
          queryClient.invalidateQueries();
          if (res.status === 1) {
            toast.success('Successfully Modified Stream');
          } else {
            toast.error('Failed to modify stream');
          }
        });
      },
      onError: (error) => {
        toast.error(error.message || "Couldn't modify stream");
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
