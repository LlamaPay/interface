import * as React from 'react';
import { InputAmount, InputAmountWithDuration, InputText, SubmitButton } from 'components/Form';
import { Switch } from '@headlessui/react';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import { useAccount, useContractWrite, useProvider } from 'wagmi';
import BigNumber from 'bignumber.js';
import { BeatLoader } from 'react-spinners';
import vestingFactoryReadable from 'abis/vestingFactoryReadable';
import { secondsByDuration } from 'utils/constants';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { TransactionDialog } from 'components/Dialog';
import { useDialogState } from 'ariakit';
import Link from 'next/link';
import useGetVestingInfo from 'queries/useGetVestingInfo';
import { ArrowCircleLeftIcon } from '@heroicons/react/outline';
import Confirm, { IVestingData } from './Confirm';
import { createERC20Contract } from 'utils/tokenUtils';
import { getAddress } from 'ethers/lib/utils';
import { checkApproval, createContractAndCheckApproval } from 'components/Form/utils';

interface IVestingElements {
  recipientAddress: { value: string };
  vestedToken: { value: string };
  vestingAmount: { value: string };
  vestingTime: { value: string };
  vestingDuration: { value: 'year' | 'month' | 'week' };
  cliffTime: { value: string };
  cliffDuration: { value: 'year' | 'month' | 'week' };
  startDate: { value: string };
}

export default function CreateVesting({ factory }: { factory: string }) {
  // form switches
  const [includeCliff, setIncludeCliff] = React.useState<boolean>(false);
  const [includeCustomStart, setIncludeCustomStart] = React.useState<boolean>(false);
  const [showChart, setShowChart] = React.useState<boolean>(false);

  // form input values
  const [vestingDuration, setVestingDuration] = React.useState<string>('week');
  const [cliffDuration, setCliffDuration] = React.useState<string>('week');
  const [vestedToken, setVestedToken] = React.useState<string>('');
  const [vestedAmount, setVestedAmount] = React.useState<string>('');

  const [transactionHash, setTransactionHash] = React.useState<string>('');

  const [vestingData, setVestingData] = React.useState<IVestingData | null>(null);

  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();

  const { mutate: approveToken, isLoading: approvingToken } = useApproveToken();

  const queryClient = useQueryClient();

  const transactionDialog = useDialogState();

  const confirmDialog = useDialogState();

  const [{ loading }, deploy_vesting_contract] = useContractWrite(
    {
      addressOrName: factory,
      contractInterface: vestingFactoryReadable,
    },
    'deploy_vesting_contract'
  );

  const provider = useProvider();
  const [{ data: accountData }] = useAccount();

  // keep query active in this page so when vesting tx is submitted, this query is invalidated and user can see the data when they navigate to /vesting page
  useGetVestingInfo();

  const checkApprovalOnChange = (vestedToken: string, vestedAmount: string) => {
    if (accountData && provider && vestedToken !== '' && vestedAmount !== '') {
      createContractAndCheckApproval({
        userAddress: accountData.address,
        tokenAddress: vestedToken,
        provider,
        approvalFn: checkTokenApproval,
        approvedForAmount: vestedAmount,
        approveForAddress: factory,
      });
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement & IVestingElements;
    const recipientAddress = form.recipientAddress.value;
    const vestingTime = form.vestingTime.value;
    const cliffTime = form.cliffTime?.value;
    const vestedToken = form.vestedToken.value;
    const vestingAmount = form.vestingAmount.value;

    const fmtVestingTime = new BigNumber(vestingTime).times(secondsByDuration[vestingDuration]).toFixed(0);
    const date = includeCustomStart ? new Date(form.startDate.value) : new Date(Date.now());

    if (date.toString() === 'Invalid Date') {
      toast.error('Invalid Date');
      return;
    }

    const startTime = new BigNumber(Number(date) / 1e3).toFixed(0);
    const fmtCliffTime = includeCliff
      ? new BigNumber(cliffTime).times(secondsByDuration[cliffDuration]).toFixed(0)
      : '0';

    const tokenContract = createERC20Contract({ tokenAddress: getAddress(vestedToken), provider });
    const decimals = await tokenContract.decimals();
    const formattedAmt = new BigNumber(vestingAmount).times(10 ** decimals).toFixed(0);

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
              userAddress: accountData?.address,
              approvedForAmount: vestingAmount,
              checkTokenApproval,
            });
          },
        }
      );
    }
  }

  const handleVestTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVestedToken(e.target.value);
    checkApprovalOnChange(e.target.value, vestedAmount);
  };

  const handleVestAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVestedAmount(e.target.value);
    checkApprovalOnChange(vestedToken, e.target.value);
  };

  function onConfirm() {
    if (!vestingData) return;
    deploy_vesting_contract({
      args: [
        vestingData?.vestedToken,
        vestingData?.recipientAddress,
        vestingData?.vestingAmount,
        vestingData?.vestingDuration,
        vestingData?.startTime,
        vestingData?.cliffTime,
      ],
    }).then((tx) => {
      if (tx.error) {
        toast.error(tx.error.message);
      } else {
        const toastid = toast.loading('Creating Contract');
        setTransactionHash(tx.data.hash);
        confirmDialog.hide();
        transactionDialog.show();
        tx.data.wait().then((receipt) => {
          toast.dismiss(toastid);
          if (receipt.status === 1) {
            toast.success('Successfuly Created Contract');
          } else {
            toast.error('Failed to Create Contract');
          }
          queryClient.invalidateQueries();
        });
      }
    });
  }

  return (
    <section className="relative w-full">
      <form className="mx-auto flex max-w-xl flex-col gap-4" onSubmit={onSubmit}>
        <Link href="/vesting">
          <a className="relative left-[-2px] flex items-center gap-2">
            <ArrowCircleLeftIcon className="h-6 w-6" />
            <span className="">Return</span>
          </a>
        </Link>
        <h1 className="font-exo my-2 text-2xl font-semibold text-[#3D3D3D] dark:text-white">Set Up Vesting</h1>
        <InputText label={'Recipient Address'} name="recipientAddress" isRequired />
        <InputText label={'Vested Token Address'} name="vestedToken" handleChange={handleVestTokenChange} isRequired />
        <InputAmount label={'Vesting Amount'} name="vestingAmount" handleChange={handleVestAmountChange} isRequired />
        <InputAmountWithDuration
          label={'Vesting Duration'}
          name="vestingTime"
          isRequired
          selectInputName="vestingDuration"
          handleSelectChange={(e) => setVestingDuration(e.target.value)}
        />
        {includeCliff && (
          <InputAmountWithDuration
            label={'Cliff Duration'}
            name="cliffTime"
            isRequired
            selectInputName="cliffDuration"
            handleSelectChange={(e) => setCliffDuration(e.target.value)}
          />
        )}
        {includeCustomStart && (
          <InputText
            label={'Start Date (YYYY-MM-DD)'}
            name="startDate"
            isRequired
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
          />
        )}
        <div className="flex gap-2">
          <span className="font-exo">{'Include Cliff'}</span>
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
          <span className="font-exo">{`Custom Start`}</span>
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
          <span className="font-exo">{'Show Chart'}</span>
          <Switch
            checked={showChart}
            onChange={setShowChart}
            className={`${
              showChart ? 'bg-[#23BD8F]' : 'bg-gray-200 dark:bg-[#252525]'
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span
              className={`${
                showChart ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
        </div>

        <SubmitButton className="mt-5">
          {loading || checkingApproval || approvingToken ? (
            <BeatLoader size={6} color="white" />
          ) : isApproved ? (
            'Create Contract'
          ) : (
            'Approve Token'
          )}
        </SubmitButton>
      </form>
      <TransactionDialog dialog={transactionDialog} transactionHash={transactionHash} />
      {vestingData && <Confirm dialog={confirmDialog} vestingData={vestingData} onConfirm={onConfirm} />}
    </section>
  );
}
