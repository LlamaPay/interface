import { ethers, Signer } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { useSigner } from 'wagmi';
import { useNetworkProvider } from 'hooks';
import { scheduledTransfers } from 'lib/abis/scheduledTransfers';
import { networkDetails } from 'lib/networkDetails';
import { ITransactionError, ITransactionSuccess } from 'types';

interface ICreateContract {
  oracleAddress?: string;
}

interface ICreate extends ICreateContract {
  factoryAddress?: string | null;
  signer?: Signer;
}

const create = async ({ factoryAddress, signer, oracleAddress }: ICreate) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    }

    if (!oracleAddress) {
      throw new Error('Invalid address');
    }

    if (!factoryAddress) {
      throw new Error('Invalid Factory Address');
    }

    const contract = new ethers.Contract(getAddress(factoryAddress), scheduledTransfers, signer);

    return await contract.createContract(getAddress(oracleAddress), {
      gasLimit: 250000,
    });
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't create contract"));
  }
};

export default function useCreateScheduledTransferContract() {
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();

  const { chainId } = useNetworkProvider();

  const factoryAddress = chainId ? networkDetails[chainId].scheduledTransferFactory : null;

  return useMutation<ITransactionSuccess, ITransactionError, ICreateContract, unknown>(
    ({ oracleAddress }: ICreateContract) => create({ factoryAddress, signer, oracleAddress }),
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
