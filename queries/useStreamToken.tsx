import { Signer } from 'ethers';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { createWriteContract } from 'utils/contract';
import { useSigner } from 'wagmi';

interface IUseStreamToken {
  llamaContractAddress: string;
  payeeAddress: string;
  amountPerSec: string;
  amountToDeposit?: string;
  method: 'DEPOSIT_AND_CREATE' | 'CREATE_STREAM';
}

interface IStreamToken extends IUseStreamToken {
  signer?: Signer;
}

interface QueryError {
  message: string;
}

interface QueryResponse {
  hash: string;
  wait: Awaited<Promise<() => any>>;
}

const streamToken = async ({
  llamaContractAddress,
  payeeAddress,
  amountToDeposit,
  amountPerSec,
  signer,
  method,
}: IStreamToken) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    } else {
      const contract = createWriteContract(llamaContractAddress, signer);
      if (method === 'DEPOSIT_AND_CREATE' && amountToDeposit) {
        return await contract.depositAndCreate(amountToDeposit, payeeAddress, amountPerSec);
      } else if (method === 'CREATE_STREAM') {
        return await contract.createStream(payeeAddress, amountPerSec);
      } else {
        throw new Error("Invalid method called, Couldn't stream token");
      }
    }
  } catch (error: any) {
    // console.log(error);
    throw new Error(error.message || (error?.reason ?? "Couldn't stream token"));
  }
};

export default function useStreamToken() {
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();

  return useMutation<QueryResponse, QueryError, IUseStreamToken>(
    ({ llamaContractAddress, payeeAddress, amountToDeposit, amountPerSec, method }: IUseStreamToken) =>
      streamToken({ llamaContractAddress, payeeAddress, amountToDeposit, amountPerSec, method, signer }),
    {
      onSuccess: (data) => {
        const toastId = toast.loading('Confirming transaction');
        data.wait().then((res: any) => {
          toast.dismiss(toastId);
          queryClient.invalidateQueries();
          if (res.status === 1) {
            toast.success('Stream created successfully');
          } else {
            toast.error('Failed to create stream');
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
