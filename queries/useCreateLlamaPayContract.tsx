import { Signer } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { useMutation } from 'react-query';
import { createFactoryWriteContract } from 'utils/contract';
import { useSigner } from 'wagmi';

interface ICreateContract {
  tokenAddress: string;
}

interface IDepositToken extends ICreateContract {
  signer?: Signer;
}

const create = async ({ signer, tokenAddress }: IDepositToken) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    }

    if (!tokenAddress) {
      throw new Error('Invalid address');
    }

    const contract = createFactoryWriteContract(signer);
    await contract.createLlamaPayContract(getAddress(tokenAddress));
  } catch (error: any) {
    throw new Error(error?.reason ?? "Couldn't create contract");
  }
};

export default function useCreateLlamaPayContract() {
  const [{ data: signer }] = useSigner();

  // TODO Invalidate all queries like balances etc onSuccess
  return useMutation(({ tokenAddress }: ICreateContract) => create({ signer, tokenAddress }));
}
