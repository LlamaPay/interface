import { InputAmount, InputAmountWithDuration, InputText, SubmitButton } from 'components/Form';
import * as React from 'react';
import { Switch } from '@headlessui/react';
import useCreateVestingContract from 'queries/useCreateVestingContract';

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
  const { mutate, isLoading } = useCreateVestingContract();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as typeof e.target & IVestingElements;

    const recipientAddress = form.recipientAddress?.value;
    const vestedToken = form.vestedToken?.value;
    const vestingAmount = form.vestingAmount?.value;
    const vestingTime = form.vestingTime?.value;
    const vestingDuration = form.vestingDuration?.value;
    const cliffTime = form.cliffTime?.value;
    const cliffDuration = form.cliffDuration?.value;
    mutate({
      factory: '0x98d3872b4025ABE58C4667216047Fe549378d90f',
      recipient: recipientAddress,
      vestedToken: vestedToken,
      vestedAmount: vestingAmount,
      vestingTime: vestingTime,
      vestingDuration: vestingDuration,
      hasCustomStart: includeCustomStart,
      customStart: '0',
      hasCliff: includeCliff,
      cliffTime: cliffTime,
      cliffDuration: cliffDuration,
    });
  }

  return (
    <form className="flex max-w-xl flex-col gap-4" onSubmit={onSubmit}>
      <span className="font-exo text-2xl font-semibold text-[#3D3D3D] dark:text-white">{'Set Up Vesting'}</span>
      <InputText label={'Recipient Address'} name="recipientAddress" isRequired />
      <InputText label={'Vested Token Address'} name="vestedToken" isRequired />
      <InputAmount label={'Vesting Amount'} name="vestingAmount" isRequired />
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
      <SubmitButton className="mt-5">Create Contract</SubmitButton>
    </form>
  );
}
