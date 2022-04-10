import { Signer } from 'ethers';
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
        const res = await contract.depositAndCreate(amountToDeposit, payeeAddress, amountPerSec);
        return await res.wait();
      } else if (method === 'CREATE_STREAM') {
        const res = await contract.createStream(payeeAddress, amountPerSec);
        return await res.wait();
      } else {
        throw new Error("Invalid method called, Couldn't stream token");
      }
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't stream token"));
  }
};

export default function useStreamToken() {
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();

  // TODO Invalidate all queries like balances etc onSuccess
  return useMutation<void, QueryError, IUseStreamToken>(
    ({ llamaContractAddress, payeeAddress, amountToDeposit, amountPerSec, method }: IUseStreamToken) =>
      streamToken({ llamaContractAddress, payeeAddress, amountToDeposit, amountPerSec, method, signer }),
    {
      onSuccess: (e) => {
        // console.log(e);
      },
      onError: (e) => {
        // console.log(e.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
