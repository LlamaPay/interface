import { Signer } from 'ethers';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { createWriteContract } from 'utils/contract';
import { useSigner } from 'wagmi';

interface IUseWithdrawAll {
  llamaContractAddress: string;
  calldata: string[];
}

interface IWithdrawAll extends IUseWithdrawAll {
  signer?: Signer;
}

async function withdrawAll({ signer, llamaContractAddress, calldata }: IWithdrawAll) {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    } else {
      const contract = createWriteContract(llamaContractAddress, signer);
      return await contract.batch(calldata, true);
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? 'Sending Tokens'));
  }
}

export default function useWithdrawAll() {
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();
  return useMutation(
    ({ llamaContractAddress, calldata }: IWithdrawAll) => withdrawAll({ signer, llamaContractAddress, calldata }),
    {
      onError: (error: any) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        const toastId = toast.loading('Sending Tokens');
        data.wait().then((res: any) => {
          toast.dismiss(toastId);
          queryClient.invalidateQueries();
          if (res.status === 1) {
            toast.success('Sent Tokens');
          } else {
            toast.error('Failed to Send Tokens');
          }
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
