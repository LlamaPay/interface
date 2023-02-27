import * as React from 'react';
import { SubmitButton } from '~/components/Form';
import { TransactionDialog } from '~/components/Dialog';
import { useDialogState } from 'ariakit';
import { useNetworkProvider } from '~/hooks';
import { networkDetails } from '~/lib/networkDetails';
import { useAccount, useContractWrite, useToken } from 'wagmi';
import { WalletSelector } from '~/components/Web3';
import { BeatLoader } from '~/components/BeatLoader';
import { secondsByDuration } from '~/utils/constants';
import { subscriptionsFactoryABI } from '~/lib/abis/subscriptionsFactory';
import { getAddress } from 'ethers/lib/utils';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import BigNumber from 'bignumber.js';

interface IFormElements {
  startDate: { valueAsNumber: string };
  periodDurationNumber: { value: string };
  periodDurationType: { value: string };
  tokenAddress: { value: string };
  amount: { value: string };
}

export const CreateRefundableContract = () => {
  const [tokenAddress, setTokenAddress] = React.useState('');
  const [isConfirming, setIsConfirming] = React.useState(false);
  const { isConnected } = useAccount();

  const txHash = React.useRef('');

  const txDialogState = useDialogState();

  const walletDialog = useDialogState();

  const { chainId } = useNetworkProvider();

  const factoryAddress = chainId ? networkDetails[chainId].subscriptionsFactory : null;

  const { isLoading, writeAsync } = useContractWrite({
    address: factoryAddress as `0x${string}`,
    abi: subscriptionsFactoryABI,
    mode: 'recklesslyUnprepared',
    functionName: 'deployFlatRateERC20',
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: tokenData, isLoading: fethcingTokensData } = useToken({
    address: tokenAddress as `0x${string}`,
    enabled: new RegExp('^0x[a-fA-F0-9]{40}$').test(tokenAddress) ? true : false,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement & IFormElements;

    const startDate = new BigNumber(form.startDate.valueAsNumber).div(1e3).toFixed(0);

    const periodDurationInSeconds =
      !Number.isNaN(Number(form.periodDurationNumber.value)) && secondsByDuration[form.periodDurationType.value]
        ? Number(form.periodDurationNumber.value) * secondsByDuration[form.periodDurationType.value]
        : null;

    const tokenAddress = form.tokenAddress.value;

    const amount = Number.isNaN(Number(form.amount.value)) ? null : Number(form.amount.value);

    if (factoryAddress && startDate && periodDurationInSeconds && tokenAddress && amount && tokenData) {
      writeAsync({
        recklesslySetUnpreparedArgs: [
          startDate,
          periodDurationInSeconds,
          [[new BigNumber(amount).times(10 ** tokenData.decimals).toFixed(0, 1), getAddress(tokenAddress)]],
        ],
      })
        .then((data) => {
          setIsConfirming(true);

          txHash.current = data.hash;

          txDialogState.toggle();

          const toastId = toast.loading('Creating Contract');
          data.wait().then((receipt) => {
            toast.dismiss(toastId);
            setIsConfirming(false);
            receipt.status === 1 ? toast.success('Transaction Success') : toast.error('Transaction Failed');
            queryClient.invalidateQueries();
            router.push('/subscriptions/incoming');
          });
        })
        .catch((err) => {
          setIsConfirming(false);
          toast.error(err.reason || err.message || 'Transaction Failed');
        });
    }
  };

  return (
    <>
      <form className="mx-auto my-8 flex flex-col gap-4" onSubmit={handleSubmit}>
        <label>
          <span className="input-label">Start Date</span>
          <input type="date" name="startDate" className="input-field" required />
        </label>

        <label>
          <span className="input-label dark:text-white">Period Duration</span>
          <div className="relative flex">
            <input
              placeholder="0.0"
              className="input-field dark:border-[#252525] dark:bg-[#202020]"
              autoComplete="off"
              autoCorrect="off"
              type="text"
              spellCheck="false"
              inputMode="decimal"
              pattern="^[0-9]*[.,]?[0-9]*$"
              name="periodDurationNumber"
              required
            />
            <select
              className="absolute right-1 bottom-1 top-2 my-auto flex w-full max-w-[24%] items-center truncate rounded border-0 bg-zinc-100 p-2 pr-4 text-sm shadow-sm dark:bg-stone-600"
              style={{ backgroundSize: '1.25rem', backgroundPosition: 'calc(100% - 4px) 55%' }}
              name="periodDurationType"
              required
            >
              <option value="week">{'week'}</option>
              <option value="month">{'month'}</option>
              <option value="year">{'year'}</option>
            </select>
          </div>
        </label>

        <label>
          <span className="input-label dark:text-white">{'Token Address (ERC-20 only)'}</span>
          <input
            placeholder="Token Address"
            pattern="^0x[a-fA-F0-9]{40}$"
            className="input-field dark:border-[#252525] dark:bg-[#202020] dark:text-white"
            autoComplete="off"
            autoCorrect="off"
            type="text"
            spellCheck="false"
            name="tokenAddress"
            required
            onChange={(e) => setTokenAddress(e.target.value)}
          />
        </label>

        <label>
          <span className="input-label dark:text-white">Amount</span>

          <input
            placeholder="0.0"
            className="input-field pr-16 dark:border-[#252525] dark:bg-[#202020]"
            autoComplete="off"
            autoCorrect="off"
            type="text"
            spellCheck="false"
            inputMode="decimal"
            pattern="^[0-9]*[.,]?[0-9]*$"
            name="amount"
            required
          />
        </label>

        {!isConnected ? (
          <SubmitButton type="button" className="mt-2 rounded" onClick={walletDialog.toggle}>
            Connect Wallet
          </SubmitButton>
        ) : (
          <SubmitButton
            disabled={!factoryAddress || isLoading || isConfirming || fethcingTokensData || !tokenData}
            className="mt-2 rounded"
          >
            {!factoryAddress ? (
              'Chain not supported'
            ) : isLoading || isConfirming ? (
              <BeatLoader size="6px" color="white" />
            ) : (
              'Create Contract'
            )}
          </SubmitButton>
        )}
      </form>

      <TransactionDialog dialog={txDialogState} transactionHash={txHash.current || ''} />

      <WalletSelector dialog={walletDialog} />
    </>
  );
};
