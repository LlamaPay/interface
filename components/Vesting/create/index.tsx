import * as React from 'react';
import { InputAmount, InputAmountWithDuration, InputText, SubmitButton } from '~/components/Form';
import { Switch } from '@headlessui/react';
import { useApproveToken, useCheckTokenApproval } from '~/queries/useTokenApproval';
import { useAccount, useProvider } from 'wagmi';
import BigNumber from 'bignumber.js';
import { BeatLoader } from '~/components/BeatLoader';
import { secondsByDuration } from '~/utils/constants';
import toast from 'react-hot-toast';
import { useDialogState } from 'ariakit';
import Link from 'next/link';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';
import Confirm, { IVestingData } from './Confirm';
import { createERC20Contract } from '~/utils/tokenUtils';
import { getAddress } from 'ethers/lib/utils';
import { checkApproval, createContractAndCheckApproval } from '~/components/Form/utils';
import ChartWrapper from '../Charts/ChartWrapper';
import type { IVestingElements } from '../types';
import EOAWarning from './EOAWarning';

export default function CreateVesting({ factory }: { factory: string }) {
  const [formData, setFormData] = React.useState({
    vestedToken: '',
    vestedAmount: '',
    vestingTime: '',
    vestingDuration: 'month',
    includeCliff: false,
    includeCustomStart: false,
    cliffTime: '',
    cliffDuration: 'month',
    startDate: '',
  });

  const [vestingData, setVestingData] = React.useState<IVestingData | null>(null);
  const [recipient, setRecipient] = React.useState<string | null>(null);

  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();

  const { mutate: approveToken, isLoading: approvingToken } = useApproveToken();

  const confirmDialog = useDialogState();
  const eoaWarningDialog = useDialogState();

  const provider = useProvider();
  const { address } = useAccount();

  const checkApprovalOnChange = (vestedToken: string, vestedAmount: string) => {
    if (address && provider && vestedToken !== '' && vestedAmount !== '') {
      createContractAndCheckApproval({
        userAddress: address,
        tokenAddress: vestedToken,
        provider,
        approvalFn: checkTokenApproval,
        approvedForAmount: vestedAmount,
        approveForAddress: factory,
      });
    }
  };

  const handleChange = (value: string | boolean, type: keyof typeof formData) => {
    setFormData((prev) => ({ ...prev, [type]: value }));
  };

  const handleVestTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, vestedToken: e.target.value }));
    checkApprovalOnChange(e.target.value, formData.vestedAmount);
  };

  const handleVestAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, vestedAmount: e.target.value }));
    checkApprovalOnChange(formData.vestedToken, e.target.value);
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement & IVestingElements;
    const recipientAddress = form.recipientAddress?.value;
    const vestingTime = form.vestingTime.value;
    const cliffTime = form.cliffTime?.value;
    const vestedToken = form.vestedToken?.value;
    const vestingAmount = form.vestingAmount?.value;
    const vestingDuration = form.vestingDuration?.value;
    const cliffDuration = form.cliffDuration?.value;

    const fmtVestingTime = new BigNumber(vestingTime).times(secondsByDuration[vestingDuration]).toFixed(0);
    const date =
      formData.includeCustomStart && form.startDate?.value ? new Date(form.startDate.value) : new Date(Date.now());

    if (date.toString() === 'Invalid Date') {
      toast.error('Invalid Date');
      return;
    }

    const startTime = new BigNumber(Number(date) / 1e3).toFixed(0);
    const fmtCliffTime = formData.includeCliff
      ? new BigNumber(cliffTime).times(secondsByDuration[cliffDuration]).toFixed(0)
      : '0';

    const tokenContract = createERC20Contract({ tokenAddress: getAddress(vestedToken), provider });
    const decimals = await tokenContract.decimals();
    const formattedAmt = new BigNumber(vestingAmount).times(10 ** decimals).toFixed(0);

    const isEOA = (await provider.getCode(recipientAddress)) === '0x' ? true : false;
    if (!isEOA) {
      setRecipient(recipientAddress);
      eoaWarningDialog.show();
    }
    if (isApproved) {
      setVestingData({
        recipientAddress,
        vestedToken,
        tokenDecimals: Number(decimals),
        vestingAmount: formattedAmt,
        vestingDuration: fmtVestingTime,
        cliffTime: fmtCliffTime,
        startTime,
      });
      confirmDialog.show();
      form.reset();
      setFormData({
        vestedToken: '',
        vestedAmount: '',
        vestingTime: '',
        vestingDuration: 'year',
        includeCliff: false,
        includeCustomStart: false,
        cliffTime: '',
        cliffDuration: 'year',
        startDate: '',
      });
    } else {
      approveToken(
        {
          tokenAddress: vestedToken,
          amountToApprove: formattedAmt,
          spenderAddress: factory,
        },
        {
          onSettled: () => {
            // llamacontractAddress is approveForAddress
            checkApproval({
              tokenDetails: { tokenContract, llamaContractAddress: factory, decimals },
              userAddress: address,
              approvedForAmount: vestingAmount,
              checkTokenApproval,
            });
          },
        }
      );
    }
  }

  return (
    <section className="relative w-full">
      <form className="mx-auto flex max-w-xl flex-col gap-4" onSubmit={onSubmit}>
        <Link href="/vesting" className="relative left-[-2px] flex items-center gap-2">
          <ArrowLeftCircleIcon className="h-6 w-6" />
          <span className="">Return</span>
        </Link>
        <h1 className="font-exo my-2 text-2xl font-semibold text-lp-gray-4 dark:text-white">Set Up Vesting</h1>
        <InputText label={'Recipient Address'} name="recipientAddress" isRequired />
        <InputText label={'Vested Token Address'} name="vestedToken" handleChange={handleVestTokenChange} isRequired />
        <InputAmount label={'Vesting Amount'} name="vestingAmount" handleChange={handleVestAmountChange} isRequired />
        <InputAmountWithDuration
          label={'Vesting Duration'}
          name="vestingTime"
          isRequired
          selectInputName="vestingDuration"
          handleChange={(e) => handleChange(e.target.value, 'vestingTime')}
          handleSelectChange={(e) => handleChange(e.target.value, 'vestingDuration')}
        />
        {formData.includeCliff && (
          <InputAmountWithDuration
            label={'Cliff Duration'}
            name="cliffTime"
            isRequired
            selectInputName="cliffDuration"
            handleChange={(e) => handleChange(e.target.value, 'cliffTime')}
            handleSelectChange={(e) => handleChange(e.target.value, 'cliffDuration')}
          />
        )}
        {formData.includeCustomStart && (
          <InputText
            type="date"
            label={'Start Date'}
            name="startDate"
            isRequired
            handleChange={(e) => {
              handleChange(e.target.value, 'startDate');
            }}
            showValue={formData.startDate}
          />
        )}

        <div className="flex gap-2">
          <span className="font-exo">{'Include Cliff'}</span>
          <Switch
            checked={formData.includeCliff}
            onChange={(value: boolean) => {
              handleChange(value, 'includeCliff');
              if (!value) {
                handleChange('', 'cliffTime');
              }
            }}
            className={`${
              formData.includeCliff ? 'bg-lp-primary' : 'bg-gray-200 dark:bg-[#252525]'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                formData.includeCliff ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
          <span className="font-exo">{`Custom Start`}</span>
          <Switch
            checked={formData.includeCustomStart}
            onChange={(value: boolean) => {
              handleChange(value, 'includeCustomStart');

              if (!value) {
                handleChange('', 'startDate');
              }
            }}
            className={`${
              formData.includeCustomStart ? 'bg-lp-primary' : 'bg-gray-200 dark:bg-[#252525]'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                formData.includeCustomStart ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
        </div>

        <ChartWrapper {...formData} />

        <SubmitButton className="mt-5">
          {checkingApproval || approvingToken ? (
            <BeatLoader size="6px" color="white" />
          ) : isApproved ? (
            'Create Contract'
          ) : (
            'Approve Token'
          )}
        </SubmitButton>
      </form>

      {vestingData && <Confirm dialog={confirmDialog} vestingData={vestingData} factory={factory} />}
      <EOAWarning address={[recipient]} dialog={eoaWarningDialog} />
    </section>
  );
}
