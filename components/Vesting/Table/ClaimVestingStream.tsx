import * as React from 'react';
import { Switch } from '@headlessui/react';
import { FormDialog, TransactionDialog } from '~/components/Dialog';
import { InputAmount, InputText, SubmitButton } from '~/components/Form';
import { BeatLoader } from '~/components/BeatLoader';
import { DisclosureState, useDialogState } from 'ariakit';
import { useAccount, useContractWrite } from 'wagmi';
import BigNumber from 'bignumber.js';
import { BigNumber as EthersBigNumber } from 'ethers';
import toast from 'react-hot-toast';
import { vestingContractReadableABI } from '~/lib/abis/vestingContractReadable';
import type { IVesting } from '~/types';
import { useQueryClient } from '@tanstack/react-query';

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

  const queryClient = useQueryClient();

  const { address } = useAccount();

  const { isLoading, writeAsync: claim } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: data.contract as `0x${string}`,
    abi: vestingContractReadableABI,
    overrides: {
      gasLimit: 1000000 as any,
    },
    functionName: 'claim',
  });

  function handleClaim() {
    if (!hasCustomBeneficiary) {
      setBeneficiaryInput(address);
    }
    setInputAmount(new BigNumber(inputAmount).times(10 ** data.tokenDecimals).toFixed(0));
    claimDialog.hide();
    confirmDialog.show();
  }

  function handleClaimAll() {
    if (!hasCustomBeneficiary) {
      setBeneficiaryInput(address);
    }

    setInputAmount(EthersBigNumber.from(Math.floor(Number(data.unclaimed))).toString());
    claimDialog.hide();
    confirmDialog.show();
  }

  function handleConfirm() {
    claim({ recklesslySetUnpreparedArgs: [beneficiaryInput, inputAmount] })
      .then((data) => {
        const toastid = toast.loading('Claiming Tokens');
        setTransactionHash(data.hash);
        claimDialog.hide();
        transactionDialog.show();
        data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Claimed Tokens') : toast.error('Failed to Claim Tokens');
          queryClient.invalidateQueries();
        });
      })
      .catch((err) => {
        toast.error(err.reason || err.message || 'Transaction Failed');
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
          <SubmitButton
            className="mt-5"
            onClick={handleClaim}
            disabled={inputAmount === '' || Number.isNaN(Number(inputAmount))}
          >
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
              <p>{`Sending: ${(Number(inputAmount) / 10 ** data.tokenDecimals).toFixed(18)} ${data.tokenSymbol}`}</p>
              <p>{`To: ${beneficiaryInput}`}</p>
            </div>
          </section>
          <SubmitButton className="mt-5" onClick={handleConfirm}>
            {isLoading ? <BeatLoader size="6px" color="white" /> : 'Confirm Transaction'}
          </SubmitButton>
        </div>
      </FormDialog>
      <TransactionDialog transactionHash={transactionHash} dialog={transactionDialog} />
    </>
  );
}
