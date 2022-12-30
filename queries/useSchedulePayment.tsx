import { ethers, Signer } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { useSigner } from 'wagmi';
import { ITransactionError, ITransactionSuccess } from 'types';
import { useRouter } from 'next/router';
import { scheduledPaymentsContractABI } from 'lib/abis/scheduledPaymentsContract';

interface ICreateContract {
  toAddress?: string;
  usdAmount?: string;
  paymentStartAt?: string | number;
  paymentEndAt?: string | number;
  frequency?: number;
}

interface ICreate extends ICreateContract {
  poolAddress?: string | null;
  signer?: Signer;
}

const create = async ({
  poolAddress,
  signer,
  toAddress,
  usdAmount,
  paymentStartAt,
  paymentEndAt,
  frequency,
}: ICreate) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    }

    if (!poolAddress) {
      throw new Error('Invalid Pool Address');
    }

    if (!toAddress || !usdAmount || !paymentStartAt || !paymentEndAt || !frequency) {
      throw new Error('Invalid arguments');
    }

    const contract = new ethers.Contract(getAddress(poolAddress), scheduledPaymentsContractABI, signer);

    return await contract.scheduleTransfer(getAddress(toAddress), usdAmount, paymentStartAt, paymentEndAt, frequency);
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't schedule payment"));
  }
};

export function useCreateScheduledTransferPayment({ poolAddress }: { poolAddress?: string | null }) {
  const [{ data: signer }] = useSigner();

  const queryClient = useQueryClient();

  const router = useRouter();

  return useMutation<ITransactionSuccess, ITransactionError, ICreateContract, unknown>(
    ({ toAddress, usdAmount, paymentStartAt, paymentEndAt, frequency }: ICreateContract) =>
      create({ poolAddress, toAddress, usdAmount, paymentStartAt, paymentEndAt, frequency, signer }),
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
              toast.error('Failed to schedule payment');
            }
          })
          .catch(() => {
            toast.dismiss(toastId);
            toast.error('Failed to schedule payment');
          });
      },
      onError: (error) => {
        toast.error(error.message || "Couldn't schedule payment");
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
