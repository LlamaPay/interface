import { Signer } from 'ethers';
import { useMutation } from 'react-query';
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
        await contract.depositAndCreate(amountToDeposit, payeeAddress, amountPerSec);
      } else if (method === 'CREATE_STREAM') {
        await contract.createStream(payeeAddress, amountPerSec);
      } else {
        throw new Error('Invalid method');
      }
    }
  } catch (error: any) {
    throw new Error(error?.reason ?? "Couldn't stream token");
  }
};

export default function useStreamToken() {
  const [{ data: signer }] = useSigner();

  // TODO Invalidate all queries like balances etc onSuccess
  return useMutation(({ llamaContractAddress, payeeAddress, amountToDeposit, amountPerSec, method }: IUseStreamToken) =>
    streamToken({ llamaContractAddress, payeeAddress, amountToDeposit, amountPerSec, method, signer })
  );
}
