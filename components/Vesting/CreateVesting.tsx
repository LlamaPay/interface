import { InputAmount, InputAmountWithDuration, InputText, SubmitButton } from 'components/Form';
import * as React from 'react';
import { Switch } from '@headlessui/react';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import { createERC20Contract, ICheckTokenAllowance } from 'utils/tokenUtils';
import { getAddress } from 'ethers/lib/utils';
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
import { ChevronDoubleLeftIcon } from '@heroicons/react/outline';

interface IVestingElements {
  recipientAddress: { value: string };
  vestedToken: { value: string };
  vestingAmount: { value: string };
  vestingTime: { value: string };
  vestingDuration: { value: 'year' | 'month' | 'week' };
  cliffTime: { value: string };
  cliffDuration: { value: 'year' | 'month' | 'week' };
}

export default function CreateVesting() {
  const [includeCliff, setIncludeCliff] = React.useState<boolean>(false);
  const [includeCustomStart, setIncludeCustomStart] = React.useState<boolean>(false);
  const [vestingAmount, setVestingAmount] = React.useState<string>('');
  const [formattedAmt, setFormattedAmt] = React.useState<string>('');
  const [vestedToken, setVestedToken] = React.useState<string>('');
  const [transactionHash, setTransactionHash] = React.useState<string>('');
  const transactionDialog = useDialogState();
  const [lmao, setLmao] = React.useState<boolean>(true);
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();
  const { mutate: approveToken, isLoading: approvingToken } = useApproveToken();
  const provider = useProvider();
  const [{ data: accountData }] = useAccount();
  const queryClient = useQueryClient();
  const factory = '0xdC6Ac3c1ec8dC4bA2884AF348e76b8bc4807bF1E';

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
  }, [vestingAmount, vestedToken, lmao]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as typeof e.target & IVestingElements;
    const recipientAddress = form.recipientAddress.value;
    const vestingTime = new BigNumber(form.vestingTime.value)
      .times(secondsByDuration[form.vestingDuration.value])
      .toFixed(0);
    const toStart = includeCustomStart ? '' : new BigNumber(Date.now() / 1e3).toFixed(0);
    const cliffTime = includeCliff
      ? new BigNumber(form.cliffTime.value).times(secondsByDuration[form.cliffDuration.value]).toFixed(0)
      : '0';
    if (isApproved) {
      deploy_vesting_contract({
        args: [vestedToken, recipientAddress, formattedAmt, vestingTime, toStart, cliffTime],
      }).then((data) => {
        if (data.error) {
          toast.error(data.error.message);
        } else {
          const toastid = toast.loading('Creating Contract');
          setTransactionHash(data.data.hash);
          transactionDialog.show();
          data.data.wait().then((receipt) => {
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
        />
        {includeCliff ? (
          <InputAmountWithDuration
            label={'Cliff Duration'}
            name="cliffTime"
            isRequired
            selectInputName="cliffDuration"
          />
        ) : (
          ''
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
          <span className="font-exo">{`Custom Start Time`}</span>
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
    </>
  );
}
