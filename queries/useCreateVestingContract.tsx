import { ethers, Signer } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { useMutation, useQueryClient } from 'react-query';
import { useSigner } from 'wagmi';
import BigNumber from 'bignumber.js';
import { secondsByDuration } from 'utils/constants';
import toast from 'react-hot-toast';
import { ITransactionError, ITransactionSuccess } from 'types';
import vestingFactoryReadable from 'abis/vestingFactoryReadable';

interface IUseCreateVestingContract {
  factory: string;
  recipient: string;
  vestedToken: string;
  vestedAmount: string;
  vestingTime: string;
  vestingDuration: string;
  hasCustomStart: boolean;
  customStart?: string;
  hasCliff: boolean;
  cliffTime?: string;
  cliffDuration?: string;
}

interface ICreateVestingContract extends IUseCreateVestingContract {
  signer?: Signer;
}

async function createVestingContract({
  signer,
  factory,
  recipient,
  vestedToken,
  vestedAmount,
  vestingTime,
  vestingDuration,
  hasCustomStart,
  customStart,
  hasCliff,
  cliffTime,
  cliffDuration,
}: ICreateVestingContract) {
  try {
    if (!signer) {
      throw new Error('Could not get signer');
    } else {
      const factoryContract = new ethers.Contract(getAddress(factory), vestingFactoryReadable, signer);
      const convertedVestingDuration = new BigNumber(vestingTime).times(secondsByDuration[vestingDuration]).toFixed(0);
      const toStart =
        hasCustomStart && customStart ? new BigNumber(customStart).toFixed(0) : new BigNumber(0).toFixed(0);
      const cliffAmount =
        hasCliff && cliffTime && cliffDuration
          ? new BigNumber(cliffTime).times(secondsByDuration[cliffDuration]).toFixed(0)
          : new BigNumber(0).toFixed(0);
      return await factoryContract.deploy_vesting_contract(
        vestedToken,
        recipient,
        vestedAmount,
        convertedVestingDuration,
        toStart,
        cliffAmount
      );
    }
  } catch (error: any) {
    throw new Error(error.message || "Couldn't Create Vesting Contract");
  }
}

export default function useCreateVestingContract() {
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();
  return useMutation<ITransactionSuccess, ITransactionError, IUseCreateVestingContract, unknown>(
    ({
      recipient,
      factory,
      vestedToken,
      vestedAmount,
      vestingTime,
      vestingDuration,
      hasCustomStart,
      customStart,
      hasCliff,
      cliffTime,
      cliffDuration,
    }: IUseCreateVestingContract) =>
      createVestingContract({
        signer,
        recipient,
        factory,
        vestedToken,
        vestedAmount,
        vestingTime,
        vestingDuration,
        hasCustomStart,
        customStart,
        hasCliff,
        cliffTime,
        cliffDuration,
      }),
    {
      onError: (error) => {
        toast.error(error.message || 'Transaction Failed');
      },
      onSuccess: (data) => {
        const bubble = toast.loading('Creating Contract');
        data.wait().then((result) => {
          toast.dismiss(bubble);
          queryClient.invalidateQueries();
          if (result.status === 1) {
            toast.success('Successfully Created Contract');
          } else {
            toast.error('Failed to Create Contract');
          }
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
