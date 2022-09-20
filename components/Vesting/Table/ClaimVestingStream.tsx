import * as React from 'react';
import { Switch } from '@headlessui/react';
import { FormDialog, TransactionDialog } from 'components/Dialog';
import { InputAmount, InputText, SubmitButton } from 'components/Form';
import { BeatLoader } from 'react-spinners';
import { DisclosureState, useDialogState } from 'ariakit';
import { useAccount, useContractWrite } from 'wagmi';
import BigNumber from 'bignumber.js';
import toast from 'react-hot-toast';
import vestingContractReadable from 'abis/vestingContractReadable';
import { IVesting } from 'types';

export default function ClaimVesting({
  claimValues,
  claimDialog,
}: {
  claimValues: React.MutableRefObject<IVesting>;
  claimDialog: DisclosureState;
}) {
  const data = claimValues.current;

  const [inputAmount, setInputAmount] = React.useState<string>('');
  const [beneficiaryInput, setBeneficiaryInput] = React.useState<string | undefined>('');
  const [hasCustomBeneficiary, setHasCustomBeneficiary] = React.useState<boolean>(false);
  const [transactionHash, setTransactionHash] = React.useState<string>('');
  const transactionDialog = useDialogState();
  const confirmDialog = useDialogState();

  const [{ data: accountData }] = useAccount();

  const [{ loading }, claim] = useContractWrite(
    {
      addressOrName: data.contract,
      contractInterface: vestingContractReadable,
    },
    'claim',
    {
      overrides: {
        gasLimit: 180000,
      },
    }
  );

  function handleClaim() {
    if (!hasCustomBeneficiary) {
      setBeneficiaryInput(accountData?.address);
    }
    setInputAmount(new BigNumber(inputAmount).times(10 ** data.tokenDecimals).toFixed(0));
    claimDialog.hide();
    confirmDialog.show();
  }

  function handleClaimAll() {
    if (!hasCustomBeneficiary) {
      setBeneficiaryInput(accountData?.address);
    }
    setInputAmount(new BigNumber(data.unclaimed).toFixed(0));
    claimDialog.hide();
    confirmDialog.show();
  }

  function handleConfirm() {
    claim({ args: [beneficiaryInput, inputAmount] }).then((data) => {
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
      <FormDialog className="h-min" dialog={claimDialog} title={'Claim Tokens'}>
        <div className="space-y-4">
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
                hasCustomBeneficiary ? 'bg-lp-primary' : 'bg-gray-200 dark:bg-[#252525]'
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
            {'Claim Tokens'}
          </SubmitButton>
          <SubmitButton className="mt-5" onClick={handleClaimAll}>
            {'Claim All Tokens'}
          </SubmitButton>
        </div>
      </FormDialog>
      <FormDialog className="h-min" title="Confirm Claim" dialog={confirmDialog}>
        <div className="space-y-4">
          <section>
            <div className="font-exo my-1 rounded border p-2 dark:border-stone-700 dark:text-white">
              <p>{`Sending: ${(Number(inputAmount) / 10 ** data.tokenDecimals).toFixed(5)} ${data.tokenSymbol}`}</p>
              <p>{`To: ${beneficiaryInput}`}</p>
            </div>
          </section>
          <SubmitButton className="mt-5" onClick={handleConfirm}>
            {loading ? <BeatLoader size={6} color="white" /> : 'Confirm Transaction'}
          </SubmitButton>
        </div>
      </FormDialog>
      <TransactionDialog transactionHash={transactionHash} dialog={transactionDialog} />
    </>
  );
}
