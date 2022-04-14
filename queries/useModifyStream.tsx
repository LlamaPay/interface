import { Signer } from 'ethers';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
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

interface QueryError {
  message: string;
}

interface QueryResponse {
  hash: string;
  wait: Awaited<Promise<() => any>>;
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
    // console.log(error);
    throw new Error(error.message || (error?.reason ?? "Couldn't modify stream"));
  }
};

export default function useModifyStream() {
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();

  return useMutation<QueryResponse, QueryError, IUseModifyStream>(
    ({ llamaContractAddress, payeeAddress, amountPerSec, updatedAddress, updatedAmountPerSec }: IUseModifyStream) =>
      modifyStream({ llamaContractAddress, payeeAddress, amountPerSec, updatedAddress, updatedAmountPerSec, signer }),
    {
      onSuccess: (data) => {
        const toastId = toast.loading('Confirming transaction');
        data.wait().then((res: any) => {
          toast.dismiss(toastId);
          if (res.status === 1) {
            toast.success('Successfully Modified Stream');
          } else {
            toast.error('Failed to modify stream');
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
