import * as React from 'react';
import { SubmitButton } from '~/components/Form';
import { useContractWrite } from 'wagmi';
import { BeatLoader } from '~/components/BeatLoader';
import { secondsByDuration } from '~/utils/constants';
import { getAddress } from 'ethers/lib/utils';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { nonRefundableSubscriptionABI } from '~/lib/abis/nonRefundableSubscription';

interface IFormElements {
  periodDurationNumber: { value: string };
  periodDurationType: { value: string };
  tokenAddress: { value: string };
  amount: { value: string };
}

export const CreateNonRefundableSub = ({
  contractAddress,
  onTxSuccess,
  chainId,
}: {
  contractAddress?: string;
  onTxSuccess: () => void;
  chainId?: number;
}) => {
  const [isConfirming, setIsConfirming] = React.useState(false);

  const { isLoading, writeAsync } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: nonRefundableSubscriptionABI,
    mode: 'recklesslyUnprepared',
    functionName: 'addSubs',
    chainId,
  });

  const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement & IFormElements;

    const periodDurationInSeconds =
      !Number.isNaN(Number(form.periodDurationNumber.value)) && secondsByDuration[form.periodDurationType.value]
        ? Number(form.periodDurationNumber.value) * secondsByDuration[form.periodDurationType.value]
        : null;

    const tokenAddress = form.tokenAddress.value;

    const amount = Number.isNaN(Number(form.amount.value)) ? null : Number(form.amount.value);

    if (periodDurationInSeconds && tokenAddress && amount) {
      writeAsync({
        recklesslySetUnpreparedArgs: [
          [
            {
              costOfSub: amount,
              duration: periodDurationInSeconds,
              token: getAddress(tokenAddress),
            },
          ],
        ],
      })
        .then((data) => {
          setIsConfirming(true);

          data.wait().then((receipt) => {
            receipt.status === 1 ? toast.success('Transaction Success') : toast.error('Transaction Failed');
            queryClient.invalidateQueries();
            setIsConfirming(false);
            form.reset();
            onTxSuccess();
          });
        })
        .catch((err) => {
          toast.error(err.reason || err.message || 'Transaction Failed');
          setIsConfirming(false);
        });
    }
  };

  return (
    <form className="mx-auto my-8 flex flex-col gap-4" onSubmit={handleSubmit}>
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

      <SubmitButton disabled={isLoading || isConfirming} className="mt-2 rounded">
        {isLoading || isConfirming ? <BeatLoader size="6px" color="white" /> : 'Add Sub'}
      </SubmitButton>
    </form>
  );
};
