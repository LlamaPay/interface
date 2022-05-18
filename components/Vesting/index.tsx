import { InputAmount, InputAmountWithDuration, InputText, SubmitButton } from 'components/Form';
import * as React from 'react';
import { Switch } from '@headlessui/react';

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
  const [customStartTime, setCustomStartTime] = React.useState<boolean>(false);

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
          checked={customStartTime}
          onChange={setCustomStartTime}
          className={`${
            customStartTime ? 'bg-[#23BD8F]' : 'bg-gray-200 dark:bg-[#252525]'
          } relative inline-flex h-6 w-11 items-center rounded-full`}
        >
          <span
            className={`${
              customStartTime ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white`}
          />
        </Switch>
      </div>
      <SubmitButton className="mt-5">Create Contract</SubmitButton>
    </form>
  );
}
