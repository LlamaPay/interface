import { Signer } from 'ethers';
import { useMutation } from 'react-query';
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
      await contract.deposit(amountToDeposit);
    }
  } catch (error: any) {
    throw new Error(error?.reason ?? "Couldn't deposit token");
  }
};

export default function useDepositToken() {
  const [{ data: signer }] = useSigner();

  // TODO Invalidate all queries like balances etc onSuccess
  return useMutation(({ llamaContractAddress, amountToDeposit }: IUseDepositToken) =>
    deposit({ signer, llamaContractAddress, amountToDeposit })
  );
}
