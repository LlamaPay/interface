import { ethers, Signer } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSigner } from 'wagmi';
import { scheduledTransfersFactoryABI } from '~/lib/abis/scheduledTransfersFactory';
import type { ITransactionError, ITransactionSuccess } from '~/types';
import { useRouter } from 'next/router';

interface ICreateContract {
  oracleAddress?: string;
  tokenAddress?: string;
  maxPrice?: string;
}

interface ICreate extends ICreateContract {
  factoryAddress?: string | null;
  signer?: Signer;
}

const create = async ({ factoryAddress, signer, oracleAddress, tokenAddress, maxPrice }: ICreate) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    }

    if (!oracleAddress || !tokenAddress) {
      throw new Error('Invalid addresses');
    }

    if (!factoryAddress) {
      throw new Error('Invalid Factory Address');
    }

    if (!maxPrice) {
      throw new Error('Invalid Price');
    }

    const contract = new ethers.Contract(getAddress(factoryAddress), scheduledTransfersFactoryABI, signer);

    return await contract.createContract(getAddress(oracleAddress), getAddress(tokenAddress), maxPrice);
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't create contract"));
  }
};

export default function useCreateScheduledTransferContract({ factoryAddress }: { factoryAddress?: string | null }) {
  const [{ data: signer }] = useSigner();

  const queryClient = useQueryClient();

  const router = useRouter();

  return useMutation<ITransactionSuccess, ITransactionError, ICreateContract, unknown>(
    ({ oracleAddress, tokenAddress, maxPrice }: ICreateContract) =>
      create({ factoryAddress, signer, oracleAddress, tokenAddress, maxPrice }),
    {
      onSuccess: (data) => {
        const toastId = toast.loading('Confirming transaction');

        data
          .wait()
          .then((res) => {
            toast.dismiss(toastId);
            queryClient.invalidateQueries();
            if (res.status === 1) {
              toast.success('Contract created successfully');

              router.push('/token-salaries/outgoing');
            } else {
              toast.error('Failed to create contract');
            }
          })
          .catch(() => {
            toast.dismiss(toastId);
            toast.error('Failed to create contract');
          });
      },
      onError: (error) => {
        toast.error(error.message || "Couldn't create contract");
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
