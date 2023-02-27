import * as React from 'react';
import { SubmitButton } from '~/components/Form';
import { useContractWrite } from 'wagmi';
import { BeatLoader } from '~/components/BeatLoader';
import { getAddress } from 'ethers/lib/utils';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { refundableSubscriptionABI } from '~/lib/abis/refundableSubscription';

interface IFormElements {
  tokenAddress: { value: string };
  amount: { value: string };
}

export const CreateRefundableTier = ({
  period,
  contractAddress,
  onTxSuccess,
  chainId,
}: {
  period: string;
  contractAddress?: string;
  onTxSuccess: () => void;
  chainId?: number;
}) => {
  const [isConfirming, setIsConfirming] = React.useState(false);

  const { isLoading, writeAsync } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: refundableSubscriptionABI,
    mode: 'recklesslyUnprepared',
    functionName: 'addTiers',
    chainId,
  });

  const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement & IFormElements;

    const tokenAddress = form.tokenAddress.value;

    const amount = Number.isNaN(Number(form.amount.value)) ? null : Number(form.amount.value);

    if (tokenAddress && amount) {
      writeAsync({
        recklesslySetUnpreparedArgs: [[[amount, getAddress(tokenAddress)]]],
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
          setIsConfirming(false);
          toast.error(err.reason || err.message || 'Transaction Failed');
        });
    }
  };

  return (
    <form className="mx-auto my-8 flex flex-col gap-4" onSubmit={handleSubmit}>
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
        <span className="input-label dark:text-white">{`Amount per ${period}`}</span>

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
        {isLoading || isConfirming ? <BeatLoader size="6px" color="white" /> : 'Add Tier'}
      </SubmitButton>
    </form>
  );
};
