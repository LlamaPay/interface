import { InputAmount, InputAmountWithDuration, InputText, SubmitButton } from 'components/Form';
import * as React from 'react';
import { Switch } from '@headlessui/react';
import useCreateVestingContract from 'queries/useCreateVestingContract';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import { createERC20Contract, ICheckTokenAllowance } from 'utils/tokenUtils';
import { getAddress } from 'ethers/lib/utils';
import { useAccount, useProvider } from 'wagmi';
import BigNumber from 'bignumber.js';
import { BeatLoader } from 'react-spinners';

interface IVestingElements {
  recipientAddress: { value: string };
  vestedToken: { value: string };
  vestingAmount: { value: string };
  vestingTime: { value: string };
  vestingDuration: { value: 'year' | 'month' | 'week' };
  cliffTime: { value: string };
  cliffDuration: { value: 'year' | 'month' | 'week' };
}

export default function Vesting() {
  const [includeCliff, setIncludeCliff] = React.useState<boolean>(false);
  const [includeCustomStart, setIncludeCustomStart] = React.useState<boolean>(false);
  const [vestingAmount, setVestingAmount] = React.useState<string>('');
  const [formattedAmt, setFormattedAmt] = React.useState<string>('');
  const [vestedToken, setVestedToken] = React.useState<string>('');
  const [lmao, setLmao] = React.useState<boolean>(true);
  const { mutate, isLoading } = useCreateVestingContract();
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();
  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();
  const provider = useProvider();
  const [{ data: accountData }] = useAccount();

  React.useEffect(() => {
    async function checkApproval() {
      try {
        const tokenContract = createERC20Contract({ tokenAddress: getAddress(vestedToken), provider });
        const decimals = await tokenContract.decimals();
        const formatted = new BigNumber(vestingAmount).times(10 ** decimals).toFixed(0);
        setFormattedAmt(formatted);
        const data: ICheckTokenAllowance = {
          token: tokenContract,
          userAddress: accountData?.address,
          approveForAddress: factory,
          approvedForAmount: formatted,
        };
        checkTokenApproval(data);
      } catch (error: any) {
        if (error.reason !== 'invalid address') console.log(error.reason);
      }
    }
    checkApproval();
  }, [vestingAmount, vestedToken, lmao]);

  const factory = '0x73aCD60f886B8574AcA8b47dD5B37F4b7F114c5C';

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as typeof e.target & IVestingElements;
    const recipientAddress = form.recipientAddress?.value;
    const vestingTime = form.vestingTime?.value;
    const vestingDuration = form.vestingDuration?.value;
    const cliffTime = form.cliffTime?.value;
    const cliffDuration = form.cliffDuration?.value;
    if (isApproved) {
      console.log(formattedAmt);
      mutate(
        {
          factory: factory,
          recipient: recipientAddress,
          vestedToken: vestedToken,
          vestedAmount: formattedAmt,
          vestingTime: vestingTime,
          vestingDuration: vestingDuration,
          hasCustomStart: includeCustomStart,
          customStart: '0',
          hasCliff: includeCliff,
          cliffTime: cliffTime,
          cliffDuration: cliffDuration,
        },
        {
          onSettled: () => {
            setLmao(!lmao);
          },
        }
      );
    } else {
      approveToken(
        {
          tokenAddress: vestedToken,
          amountToApprove: formattedAmt,
          spenderAddress: factory,
        },
        {
          onSettled: () => {
            setLmao(!lmao);
          },
        }
      );
    }
  }

  return (
    <form className="flex max-w-xl flex-col gap-4" onSubmit={onSubmit}>
      <span className="font-exo text-2xl font-semibold text-[#3D3D3D] dark:text-white">{'Set Up Vesting'}</span>
      <InputText label={'Recipient Address'} name="recipientAddress" isRequired />
      <InputText
        label={'Vested Token Address'}
        name="vestedToken"
        isRequired
        handleChange={(e) => setVestedToken(e.target.value)}
      />
      <InputAmount
        label={'Vesting Amount'}
        name="vestingAmount"
        isRequired
        handleChange={(e) => setVestingAmount(e.target.value)}
      />
      <InputAmountWithDuration
        label={'Vesting Duration'}
        name="vestingTime"
        isRequired
        selectInputName="vestingDuration"
      />
      {includeCliff ? (
        <InputAmountWithDuration label={'Cliff Duration'} name="cliffTime" isRequired selectInputName="cliffDuration" />
      ) : (
        ''
      )}
      <div className="flex gap-2">
        <span>{'Include Cliff'}</span>
        <Switch
          checked={includeCliff}
          onChange={setIncludeCliff}
          className={`${
            includeCliff ? 'bg-[#23BD8F]' : 'bg-gray-200 dark:bg-[#252525]'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              includeCliff ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white`}
          />
        </Switch>
        <span>{`Custom Start Time`}</span>
        <Switch
          checked={includeCustomStart}
          onChange={setIncludeCustomStart}
          className={`${
            includeCustomStart ? 'bg-[#23BD8F]' : 'bg-gray-200 dark:bg-[#252525]'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              includeCustomStart ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white`}
          />
        </Switch>
      </div>
      <SubmitButton className="mt-5">
        {isLoading || checkingApproval || isLoading || approvingToken ? (
          <BeatLoader size={6} color="white" />
        ) : isApproved ? (
          'Create Contract'
        ) : (
          'Approve Token'
        )}
      </SubmitButton>
    </form>
  );
}
