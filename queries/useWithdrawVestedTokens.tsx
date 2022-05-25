import vestingContractReadable from 'abis/vestingContractReadable';
import { ethers, Signer } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { ITransactionError, ITransactionSuccess } from 'types';
import { useSigner } from 'wagmi';

interface IUseWithdrawVestedTokens {
  contract: string;
  amount: string;
  beneficiary?: string;
}

interface IWithdrawVestedTokens extends IUseWithdrawVestedTokens {
  signer?: Signer;
}

async function withdrawVestedTokens({ signer, contract, amount, beneficiary }: IWithdrawVestedTokens) {
  try {
    if (!signer) {
      throw new Error('Could not get signer');
    } else if (!beneficiary) {
      throw new Error('Could not get beneficiary data');
    } else {
      const vestingContract = new ethers.Contract(getAddress(contract), vestingContractReadable, signer);
      return await vestingContract.claim(beneficiary, amount);
    }
  } catch (error: any) {
    throw new Error(error.message || "Couldn't Withdraw Vested Tokens");
  }
}

export default function useWithdrawVestedTokens() {
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();
  return useMutation<ITransactionSuccess, ITransactionError, IUseWithdrawVestedTokens, unknown>(
    ({ contract, amount, beneficiary }: IUseWithdrawVestedTokens) =>
      withdrawVestedTokens({ signer, contract, amount, beneficiary }),
    {
      onError: (error) => {
        toast.error(error.message || 'Claim Failed');
      },
      onSuccess: (data) => {
        const bubble = toast.loading('Claiming Tokens');
        data.wait().then((result) => {
          toast.dismiss(bubble);
          queryClient.invalidateQueries();
          if (result.status === 1) {
            toast.success('Successfully Claimed Tokens');
          } else {
            toast.error('Failed to Claim Tokens');
          }
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
