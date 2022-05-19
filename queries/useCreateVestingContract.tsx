import { ethers, Signer } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { useMutation } from 'react-query';
import { useProvider, useSigner } from 'wagmi';
import vestingFactory from 'abis/vestingFactory';
import BigNumber from 'bignumber.js';
import { secondsByDuration } from 'utils/constants';
import { createERC20Contract } from 'utils/tokenUtils';

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
  provider?: ethers.providers.BaseProvider;
}

async function createVestingContract({
  signer,
  provider,
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
    if (!signer || !provider) {
      throw new Error('Could not get signer and/or provider');
    } else {
      const factoryContract = new ethers.Contract(getAddress(factory), vestingFactory, signer);
      const tokenContract = createERC20Contract({ tokenAddress: getAddress(vestedToken), provider });
      const decimals = await tokenContract.decimals();
      const convertedVestedAmount = new BigNumber(vestedAmount).times(10 ** Number(decimals)).toFixed(0);
      const convertedVestingDuration = new BigNumber(vestingTime).times(secondsByDuration[vestingDuration]).toFixed(0);
      const toStart =
        hasCustomStart && customStart
          ? new BigNumber(customStart).toFixed(0)
          : new BigNumber(Date.now() / 1e3).toFixed(0);
      const cliffAmount =
        hasCliff && cliffTime && cliffDuration
          ? new BigNumber(cliffTime).times(secondsByDuration[cliffDuration]).toFixed(0)
          : new BigNumber(0).toFixed(0);
      return await factoryContract.deploy_vesting_contract(
        vestedToken,
        recipient,
        convertedVestedAmount,
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
  const provider = useProvider();
  return useMutation(
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
        provider,
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
      })
  );
}
