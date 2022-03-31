import { Signer } from 'ethers';
import { useMutation } from 'react-query';
import { createWriteContract } from 'utils/contract';
import { useSigner } from 'wagmi';

interface IUseWithdrawToken {
  llamaContractAddress: string;
}

interface IWithdrawToken extends IUseWithdrawToken {
  signer?: Signer;
}

const withdrawPayerAll = async ({ signer, llamaContractAddress }: IWithdrawToken) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    } else {
      const contract = createWriteContract(llamaContractAddress, signer);
      await contract.withdrawPayerAll();
    }
  } catch (error: any) {
    throw new Error(error?.reason ?? "Couldn't withdraw tokens");
  }
};

export default function useWithdrawPayerAllToken() {
  const [{ data: signer }] = useSigner();

  // TODO Invalidate all queries like balances etc onSuccess
  return useMutation(({ llamaContractAddress }: IUseWithdrawToken) =>
    withdrawPayerAll({ signer, llamaContractAddress })
  );
}
