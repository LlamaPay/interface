import { Switch } from '@headlessui/react';
import vestingContractReadable from 'abis/vestingContractReadable';
import { useDialogState } from 'ariakit';
import BigNumber from 'bignumber.js';
import { FormDialog, TransactionDialog } from 'components/Dialog';
import { InputAmount, InputText, SubmitButton } from 'components/Form';
import React from 'react';
import toast from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import { IVesting } from 'types';
import { useAccount, useContractWrite } from 'wagmi';

export default function ClaimButton({ data }: { data: IVesting }) {
  const [inputAmount, setInputAmount] = React.useState<string>('');
  const [beneficiaryInput, setBeneficiaryInput] = React.useState<string>('');
  const [hasCustomBeneficiary, setHasCustomBeneficiary] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<string>('');
  const transactionDialog = useDialogState();
  const [{ data: accountData }] = useAccount();
  const [{ loading }, claim] = useContractWrite(
    {
      addressOrName: data.contract,
      contractInterface: vestingContractReadable,
    },
    'claim'
  );
  const claimDialog = useDialogState();

  function handleClaim() {
    const beneficiary = hasCustomBeneficiary ? beneficiaryInput : accountData?.address;
    const amount = new BigNumber(inputAmount).times(10 ** data.tokenDecimals).toFixed(0);
    claim({ args: [beneficiary, amount] }).then((data) => {
      if (data.error) {
        toast.error('Failed to Claim Tokens');
      } else {
        const toastid = toast.loading('Claiming Tokens');
        setTransactionHash(data.data.hash);
        claimDialog.hide();
        transactionDialog.show();
        data.data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Claimed Tokens') : toast.error('Failed to Claim Tokens');
        });
      }
    });
  }

  function handleClaimAll() {
    const beneficiary = hasCustomBeneficiary ? beneficiaryInput : accountData?.address;
    const amount = new BigNumber(data.unclaimed).toFixed(0);
    claim({ args: [beneficiary, amount] }).then((data) => {
      if (data.error) {
        toast.error('Failed to Claim Tokens');
      } else {
        const toastid = toast.loading('Claiming All Tokens');
        setTransactionHash(data.data.hash);
        claimDialog.hide();
        transactionDialog.show();
        data.data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1
            ? toast.success('Successfully Claimed All Tokens')
            : toast.error('Failed to Claim All Tokens');
        });
      }
    });
  }

  return (
    <>
      <div className="">
        {Date.now() / 1e3 >= Number(data.startTime) + Number(data.cliffLength) &&
          accountData?.address.toLowerCase() === data.recipient.toLowerCase() && (
            <button onClick={claimDialog.toggle} className="row-action-links font-exo dark:text-white">
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
              <span className="font-exo">{'Available to be Claimed'}</span>
              <div>
                <p className="font-exo dark:text-white">{`${(Number(data.unclaimed) / 10 ** data.tokenDecimals).toFixed(
                  5
                )} ${data.tokenSymbol}`}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="font-exo">{'Custom Beneficiary'}</span>
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
              handleChange={(e) => setBeneficiaryInput(e.target.value)}
              isRequired
            />
          )}
          <SubmitButton className="mt-5" onClick={handleClaim}>
            {loading ? <BeatLoader size={6} color="white" /> : 'Claim Tokens'}
          </SubmitButton>
          <SubmitButton className="mt-5" onClick={handleClaimAll}>
            {loading ? <BeatLoader size={6} color="white" /> : 'Claim All Tokens'}
          </SubmitButton>
        </span>
      </FormDialog>
      <TransactionDialog transactionHash={transactionHash} dialog={transactionDialog} />
    </>
  );
}
