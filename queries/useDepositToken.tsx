import { Signer } from 'ethers';
import { useMutation, useQueryClient } from 'react-query';
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
      const res = await contract.deposit(amountToDeposit);
      return await res.wait();
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't deposit token"));
  }
};

export default function useDepositToken() {
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();

  // TODO Invalidate all queries like balances etc onSuccess
  return useMutation(
    ({ llamaContractAddress, amountToDeposit }: IUseDepositToken) =>
      deposit({ signer, llamaContractAddress, amountToDeposit }),
    {
      onError: (e) => {
        // console.log(e);
      },
      onSuccess: (e) => {
        // console.log(e);
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
