import { Signer } from 'ethers';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { createWriteContract } from 'utils/contract';
import { useSigner } from 'wagmi';

interface IUseBatchCalls {
  llamaContractAddress: string;
  calls: string[];
}

interface IBatchCalls extends IUseBatchCalls {
  signer?: Signer;
}

async function batchCalls({ signer, llamaContractAddress, calls }: IBatchCalls) {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    } else {
      const contract = createWriteContract(llamaContractAddress, signer);
      return await contract.batch(calls, true);
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? 'Sending Tokens'));
  }
}

export default function useBatchCalls() {
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();
  return useMutation(
    ({ llamaContractAddress, calls }: IUseBatchCalls) => batchCalls({ signer, llamaContractAddress, calls }),
    {
      onError: (error: any) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        const toastId = toast.loading('Executing Batch Transactions');
        data.wait().then((res: any) => {
          toast.dismiss(toastId);
          queryClient.invalidateQueries();
          if (res.status === 1) {
            toast.success('Successfully Executed Batch Transactions');
          } else {
            toast.error('Failed to Execute Batch Transactions');
          }
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
