import * as React from 'react';
import { InputAmount, InputAmountWithDuration, InputText, SubmitButton } from 'components/Form';
import { Switch } from '@headlessui/react';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import { createERC20Contract, ICheckTokenAllowance } from 'utils/tokenUtils';
import { getAddress } from 'ethers/lib/utils';
import { useAccount, useContractWrite, useProvider } from 'wagmi';
import BigNumber from 'bignumber.js';
import { BeatLoader } from 'react-spinners';
import vestingFactoryReadable from 'abis/vestingFactoryReadable';
import { networkDetails, secondsByDuration } from 'utils/constants';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { FormDialog, TransactionDialog } from 'components/Dialog';
import { useDialogState } from 'ariakit';
import Link from 'next/link';
import { ChevronDoubleLeftIcon } from '@heroicons/react/outline';
import { useIntl } from 'next-intl';
import { useNetworkProvider } from 'hooks';

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

interface IVestingData {
  recipientAddress: string;
  vestedToken: string;
  tokenDecimals: number;
  vestingAmount: string;
  vestingDuration: string;
  cliffTime: string;
  startTime: string;
}

export default function CreateVesting() {
  const [includeCliff, setIncludeCliff] = React.useState<boolean>(false);
  const [includeCustomStart, setIncludeCustomStart] = React.useState<boolean>(false);
  const [showChart, setShowChart] = React.useState<boolean>(false);
  const [vestingAmount, setVestingAmount] = React.useState<string>('');
  const [formattedAmt, setFormattedAmt] = React.useState<string>('');
  const [vestedToken, setVestedToken] = React.useState<string>('');
  const [vestedTokenDecimals, setVestedTokenDecimals] = React.useState<number>(0);
  const [vestingTime, setVestingTime] = React.useState<string>('');
  const [vestingDuration, setVestingDuration] = React.useState<string>('week');
  const [cliffTime, setCliffTime] = React.useState<string>('');
  const [cliffDuration, setCliffDuration] = React.useState<string>('week');
  const [transactionHash, setTransactionHash] = React.useState<string>('');
  const [vestingData, setVestingData] = React.useState<IVestingData | null>(null);
  const transactionDialog = useDialogState();
  const confirmDialog = useDialogState();
  const [lmao, setLmao] = React.useState<boolean>(true);
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();
  const { mutate: approveToken, isLoading: approvingToken } = useApproveToken();
  const provider = useProvider();
  const [{ data: accountData }] = useAccount();
  const { chainId } = useNetworkProvider();
  const queryClient = useQueryClient();
  const intl = useIntl();
  const factory = chainId ? networkDetails[chainId]?.vestingFactory : '';

  const [{ loading }, deploy_vesting_contract] = useContractWrite(
    {
      addressOrName: factory,
      contractInterface: vestingFactoryReadable,
    },
    'deploy_vesting_contract'
  );

  React.useEffect(() => {
    async function checkApproval() {
      try {
        const tokenContract = createERC20Contract({ tokenAddress: getAddress(vestedToken), provider });
        const decimals = await tokenContract.decimals();
        setVestedTokenDecimals(Number(decimals));
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
        if (error.reason !== 'invalid address') console.error(error.reason);
      }
    }
    checkApproval();
  }, [vestingAmount, vestedToken, lmao, provider, accountData?.address, checkTokenApproval, factory]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as typeof e.target & IVestingElements;
    const recipientAddress = form.recipientAddress.value;
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

    if (isApproved) {
      setVestingData({
        recipientAddress,
        vestedToken,
        tokenDecimals: vestedTokenDecimals,
        vestingAmount: formattedAmt,
        vestingDuration: fmtVestingTime,
        cliffTime: fmtCliffTime,
        startTime,
      });
      confirmDialog.show();
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
    }).then((data) => {
      if (data.error) {
        toast.error(data.error.message);
      } else {
        const toastid = toast.loading('Creating Contract');
        setTransactionHash(data.data.hash);
        confirmDialog.hide();
        transactionDialog.show();
        data.data.wait().then((receipt) => {
          toast.dismiss(toastid);
          if (receipt.status === 1) {
            toast.success('Successfuly Created Contract');
          } else {
            toast.error('Failed to Create Contract');
          }
          queryClient.invalidateQueries();
          setLmao(!lmao);
        });
      }
    });
  }

  return (
    <>
      <div className="max-w-xl">
        <Link href="/vesting">
          <a className="flex gap-1 align-middle">
            <ChevronDoubleLeftIcon className="h-6 w-6" />
            <span className="text-md font-exo font-bold">Return</span>
          </a>
        </Link>
      </div>
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
          handleChange={(e) => setVestingTime(e.target.value)}
          handleSelectChange={(e) => setVestingDuration(e.target.value)}
        />
        {includeCliff && (
          <InputAmountWithDuration
            label={'Cliff Duration'}
            name="cliffTime"
            isRequired
            selectInputName="cliffDuration"
            handleChange={(e) => setCliffTime(e.target.value)}
            handleSelectChange={(e) => setCliffDuration(e.target.value)}
          />
        )}
        {includeCustomStart && (
          <InputText label={'Start Date (YYYY-MM-DD)'} name="startDate" isRequired placeholder="YYYY-MM-DD" />
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
          {loading || checkingApproval || loading || approvingToken ? (
            <BeatLoader size={6} color="white" />
          ) : isApproved ? (
            'Create Contract'
          ) : (
            'Approve Token'
          )}
        </SubmitButton>
      </form>
      <TransactionDialog dialog={transactionDialog} transactionHash={transactionHash} />
      {vestingData && (
        <FormDialog dialog={confirmDialog} title={'Confirm Vesting Contract'}>
          <div className="space-y-4">
            <div className="font-exo my-1 rounded border p-2 dark:border-stone-700 dark:text-white">
              <p>{`Recipient: ${vestingData?.recipientAddress}`}</p>
              <p>{`Token: ${vestingData?.vestedToken}`}</p>
              <p>{`Amount: ${(Number(vestingData?.vestingAmount) / 10 ** vestingData?.tokenDecimals).toFixed(5)}`}</p>
              <p>{`Starts: ${intl.formatDateTime(new Date(Number(vestingData.startTime) * 1e3), {
                dateStyle: 'short',
                timeStyle: 'short',
              })} (${intl.formatDateTime(new Date(Number(vestingData.startTime) * 1e3), {
                dateStyle: 'short',
                timeStyle: 'short',
                timeZone: 'utc',
              })} UTC)`}</p>
              {vestingData.cliffTime !== '0' && (
                <>
                  <p>{`Cliff Duration: ${(Number(vestingData.cliffTime) / 86400).toFixed(2)} days`}</p>
                  <p>{`Cliff Ends: ${intl.formatDateTime(
                    new Date((Number(vestingData.startTime) + Number(vestingData.cliffTime)) * 1e3),
                    {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    }
                  )} (${intl.formatDateTime(
                    new Date((Number(vestingData.startTime) + Number(vestingData.cliffTime)) * 1e3),
                    {
                      dateStyle: 'short',
                      timeStyle: 'short',
                      timeZone: 'utc',
                    }
                  )} UTC)`}</p>
                </>
              )}
              <p>{`Ends: ${intl.formatDateTime(
                new Date(
                  (Number(vestingData.startTime) +
                    Number(vestingData.cliffTime) +
                    Number(vestingData.vestingDuration)) *
                    1e3
                ),
                {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }
              )} (${intl.formatDateTime(
                new Date(
                  (Number(vestingData.startTime) +
                    Number(vestingData.cliffTime) +
                    Number(vestingData.vestingDuration)) *
                    1e3
                ),
                {
                  dateStyle: 'short',
                  timeStyle: 'short',
                  timeZone: 'utc',
                }
              )} UTC) `}</p>
            </div>
            <SubmitButton className="mt-5" onClick={onConfirm}>
              {loading || checkingApproval || loading || approvingToken ? (
                <BeatLoader size={6} color="white" />
              ) : (
                'Confirm Transaction'
              )}
            </SubmitButton>
          </div>
        </FormDialog>
      )}
    </>
  );
}
