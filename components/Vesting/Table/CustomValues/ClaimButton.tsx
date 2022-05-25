import { Switch } from '@headlessui/react';
import { useDialogState } from 'ariakit';
import BigNumber from 'bignumber.js';
import { FormDialog } from 'components/Dialog';
import { InputAmount, InputText, SubmitButton } from 'components/Form';
import useWithdrawVestedTokens from 'queries/useWithdrawVestedTokens';
import React from 'react';
import { IVesting } from 'types';
import { useAccount } from 'wagmi';

export default function ClaimButton({ data }: { data: IVesting }) {
  const [inputAmount, setInputAmount] = React.useState<string>('');
  const [beneficiary, setBeneficiary] = React.useState<string>('');
  const [hasCustomBeneficiary, setHasCustomBeneficiary] = React.useState<boolean>(false);
  const { mutate } = useWithdrawVestedTokens();
  const [{ data: accountData }] = useAccount();
  const claimDialog = useDialogState();

  function handleSubmit() {
    const amount = new BigNumber(inputAmount).times(10 ** data.tokenDecimals).toFixed(0);
    mutate({
      contract: data.contract,
      amount: amount,
      beneficiary: hasCustomBeneficiary ? beneficiary : accountData?.address,
    });
    claimDialog.hide();
  }

  function claimAllTokens() {
    const amount = new BigNumber(data.unclaimed).times(10 ** data.tokenDecimals).toFixed(0);
    mutate({
      contract: data.contract,
      amount: amount,
      beneficiary: hasCustomBeneficiary ? beneficiary : accountData?.address,
    });
    claimDialog.hide();
  }

  return (
    <>
      <div className="float-right">
        {Date.now() / 1e3 >= Number(data.startTime) + Number(data.cliffLength) &&
          accountData?.address.toLowerCase() === data.recipient.toLowerCase() && (
            <button onClick={claimDialog.toggle} className="row-action-links dark:text-white">
              Claim Tokens
            </button>
          )}
      </div>
      <FormDialog className="h-min" dialog={claimDialog} title={'Claim Tokens'}>
        <span className="space-y-4">
          <div>
            <InputAmount
              name="amount"
              label="Amount to Claim"
              isRequired
              handleChange={(e) => setInputAmount(e.target.value)}
              className="dark:border-[#252525] dark:bg-[#202020] dark:text-white"
            />
            <div className="mt-[5px] flex flex-wrap items-center justify-between gap-4 rounded bg-[#E7E7E7]/40 px-2 py-1 text-xs text-[#4E575F] dark:bg-[#252525] dark:text-white">
              <span>{'Available to be Claimed'}</span>
              <div>
                <p className="dark:text-white">{`${(Number(data.unclaimed) / 10 ** data.tokenDecimals).toFixed(5)} ${
                  data.tokenSymbol
                }`}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <span>{'Custom Beneficiary'}</span>
            <Switch
              checked={hasCustomBeneficiary}
              onChange={setHasCustomBeneficiary}
              className={`${
                hasCustomBeneficiary ? 'bg-[#23BD8F]' : 'bg-gray-200 dark:bg-[#252525]'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  hasCustomBeneficiary ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white`}
              />
            </Switch>
          </div>
          {hasCustomBeneficiary && (
            <InputText
              label={'Beneficiary'}
              name="beneficiary"
              handleChange={(e) => setBeneficiary(e.target.value)}
              isRequired
            />
          )}
          <SubmitButton className="mt-5" onClick={handleSubmit}>
            {'Claim Tokens'}
          </SubmitButton>
          <SubmitButton className="mt-5" onClick={claimAllTokens}>
            {'Claim All Tokens'}
          </SubmitButton>
        </span>
      </FormDialog>
    </>
  );
}
