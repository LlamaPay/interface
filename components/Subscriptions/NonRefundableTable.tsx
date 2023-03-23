import { PlusIcon } from '@heroicons/react/24/outline';
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import { useBalance, useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi';
import { networkDetails } from '~/lib/networkDetails';
import type { INonRefundable, ISub } from '~/queries/useGetSubscriptions';
import { formatFrequency } from '../ScheduledTransfers/utils';
import Tooltip from '../Tooltip';
import { useLocale } from '~/hooks';
import Link from 'next/link';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { FormDialog, TransactionDialog } from '../Dialog';
import { DisclosureState, useDialogState } from 'ariakit';
import { nonRefundableSubscriptionABI } from '~/lib/abis/nonRefundableSubscription';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import * as React from 'react';
import { BeatLoader } from '../BeatLoader';
import { InputAmount, SubmitButton } from '../Form';
import { CreateNonRefundableSub } from './CreateNonRefundableSub';
import BigNumber from 'bignumber.js';
import AvailableAmount from '../AvailableAmount';
import { useTranslations } from 'next-intl';

export function NonRefundableTable({ data, userAddress }: { data: Array<INonRefundable>; userAddress: string }) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((contract) => (
        <Contract key={'non-refundable-subs' + contract.id} data={contract} userAddress={userAddress} />
      ))}
    </div>
  );
}

const Contract = ({ data, userAddress }: { data: INonRefundable; userAddress: string }) => {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const { chain } = useNetwork();

  const explorerUrl = chain ? networkDetails[chain.id]?.blockExplorerURL : null;

  const subDialog = useDialogState();
  const whitelistDialog = useDialogState();
  const txDialogState = useDialogState();
  const txHash = React.useRef('');

  const { isLoading, writeAsync } = useContractWrite({
    address: data.address as `0x${string}`,
    abi: nonRefundableSubscriptionABI,
    chainId: chain?.id,
    functionName: 'addWhitelist',
    mode: 'recklesslyUnprepared',
  });

  const queryClient = useQueryClient();

  const whitelistAddress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement & { addressToWhitelist: { value: string } };

    const addressToWhitelist = form.addressToWhitelist.value;

    if (writeAsync) {
      writeAsync({ recklesslySetUnpreparedArgs: [addressToWhitelist] })
        .then((data) => {
          setIsConfirming(true);

          data.wait().then((receipt) => {
            receipt.status === 1 ? toast.success('Transaction Success') : toast.error('Transaction Failed');
            form.reset();
            queryClient.invalidateQueries();
            setIsConfirming(false);

            whitelistDialog.setOpen(false);
          });
        })
        .catch((err) => {
          toast.error(err.reason || err.message || 'Transaction Failed');
          setIsConfirming(false);
        });
    } else {
      toast.error('Failed to interact with contract');
    }
  };

  const tokens: Array<{ address: string; decimals: number; name: string; symbol: string }> = [];

  data.subs.forEach((sub) => {
    if (!tokens.find((t) => t.address.toLowerCase() === sub.token.address.toLowerCase())) {
      tokens.push(sub.token);
    }
  });

  const isNotOwner = data.owner.address.toLowerCase() !== userAddress.toLowerCase();

  return (
    <div className="max-w-[calc(100vw-16px)] overflow-x-auto border border-dashed border-llama-teal-2 p-1 dark:border-lp-gray-7 md:max-w-[calc(100vw-48px)] lg:max-w-[calc(100vw-256px)]">
      <table className="w-full border-collapse">
        <tbody className="border border-llama-teal-2 dark:border-lp-gray-7">
          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Address
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              {explorerUrl ? (
                <a
                  href={`${explorerUrl}/address/${data.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {data.address}
                </a>
              ) : (
                data.address
              )}
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Claimable
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              <table className="w-full border-collapse">
                <tbody className="border border-llama-teal-2 dark:border-lp-gray-7">
                  {tokens.map((token) => (
                    <ClaimableBalance
                      key={data.address + token.address + 'nonrefundabletokenbalance'}
                      token={token}
                      contractAddress={data.address}
                      chainId={chain?.id}
                      explorerUrl={explorerUrl}
                    />
                  ))}
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Subscriptions
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                      Cost of subscription
                    </th>
                    <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                      Total Subs
                    </th>
                    <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                      Duration
                    </th>
                    <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7"></th>
                    <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7"></th>
                  </tr>
                </thead>
                <tbody className="border border-llama-teal-2 dark:border-lp-gray-7">
                  {data.subs.map((sub) => (
                    <Sub
                      key={data.id + sub.id + 'nonrefundablessub'}
                      data={sub}
                      subId={sub.subId}
                      explorerUrl={explorerUrl}
                      contractAddress={data.address}
                      chainId={chain?.id}
                      txDialogState={txDialogState}
                      txHash={txHash}
                      disabled={isNotOwner}
                    />
                  ))}
                </tbody>
              </table>
              <button
                className="mx-auto mt-2 flex flex-nowrap items-center gap-2 rounded-lg border border-lp-primary py-1 px-2 disabled:cursor-not-allowed disabled:border-lp-gray-2 disabled:bg-lp-gray-1 dark:disabled:bg-lp-gray-5"
                onClick={() => subDialog.setOpen(true)}
                disabled={isNotOwner}
              >
                <PlusIcon className="h-4 w-4" />
                <span>Create Subscription</span>
              </button>
            </td>
          </tr>
          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              <span className="flex items-center gap-1">
                <span>Whitelist</span>{' '}
                <Tooltip content="Addresses that can claim balance in contract">
                  <QuestionMarkCircleIcon className="h-5 w-5" />
                </Tooltip>
              </span>
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              {data.whitelist.length === 0 ? (
                <p>You don't have any address whitelisted.</p>
              ) : (
                <table className="w-full border-collapse">
                  <tbody className="border border-llama-teal-2 dark:border-lp-gray-7">
                    {data.whitelist.map((whitelistedAddress) => (
                      <Whitelist
                        key={data.id + whitelistedAddress + 'nonrefundablessubswhitelistedaddress'}
                        address={whitelistedAddress}
                        contractAddress={data.address}
                        chainId={chain?.id}
                        explorerUrl={explorerUrl}
                        txDialogState={txDialogState}
                        txHash={txHash}
                        disabled={isNotOwner}
                      />
                    ))}
                  </tbody>
                </table>
              )}

              <button
                className="mx-auto mt-2 flex flex-nowrap items-center gap-2 rounded-lg border border-lp-primary py-1 px-2 disabled:cursor-not-allowed disabled:border-lp-gray-2 disabled:bg-lp-gray-1 dark:disabled:bg-lp-gray-5"
                onClick={() => whitelistDialog.setOpen(true)}
                disabled={isNotOwner}
              >
                <PlusIcon className="h-4 w-4" />
                <span>New Address</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <FormDialog title="Non Refundable Subscription" dialog={subDialog} className="h-fit">
        <CreateNonRefundableSub
          onTxSuccess={() => subDialog.setOpen(false)}
          contractAddress={data.address}
          chainId={chain?.id}
        />
      </FormDialog>
      <FormDialog title="Whitelist Address" dialog={whitelistDialog} className="h-fit">
        <form className="mx-auto my-8 flex flex-col gap-4" onSubmit={whitelistAddress}>
          <label>
            <span className="input-label dark:text-white">{'Token Address (ERC-20 only)'}</span>
            <input
              placeholder="Address to Whitelist"
              pattern="^0x[a-fA-F0-9]{40}$"
              className="input-field dark:border-[#252525] dark:bg-[#202020] dark:text-white"
              autoComplete="off"
              autoCorrect="off"
              type="text"
              spellCheck="false"
              name="addressToWhitelist"
              required
            />
          </label>

          <SubmitButton disabled={isLoading || isConfirming} className="mt-2 rounded">
            {isLoading || isConfirming ? <BeatLoader size="6px" color="white" /> : 'Whitelist'}
          </SubmitButton>
        </form>
      </FormDialog>
      <TransactionDialog dialog={txDialogState} transactionHash={txHash.current || ''} />
    </div>
  );
};

const Sub = ({
  data,
  subId,
  contractAddress,
  explorerUrl,
  chainId,
  txDialogState,
  txHash,
  disabled,
}: {
  data: ISub;
  subId: string;
  contractAddress: string;
  explorerUrl?: string | null;
  chainId?: number;
  txDialogState: DisclosureState;
  txHash: React.MutableRefObject<string>;
  disabled?: boolean;
}) => {
  const [isConfirming, setIsConfirming] = React.useState(false);

  const { config } = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi: nonRefundableSubscriptionABI,
    chainId,
    functionName: 'removeSubs',
    args: [[subId]],
    enabled: !data.disabled && !disabled ? true : false,
  });

  const { isLoading, writeAsync } = useContractWrite(config);

  const queryClient = useQueryClient();

  const { locale } = useLocale();

  const removeSub = () => {
    if (writeAsync) {
      writeAsync()
        .then((data) => {
          txHash.current = data.hash;

          txDialogState.setOpen(true);

          setIsConfirming(true);

          const toastId = toast.loading('Confirming Transaction');

          data.wait().then((receipt) => {
            if (toastId) {
              toast.dismiss(toastId);
            }
            receipt.status === 1 ? toast.success('Transaction Success') : toast.error('Transaction Failed');
            queryClient.invalidateQueries();
            setIsConfirming(false);
          });
        })
        .catch((err) => {
          toast.error(err.reason || err.message || 'Transaction Failed');
          setIsConfirming(false);
        });
    } else {
      toast.error('Failed to interact with contract');
    }
  };

  return (
    <>
      <tr>
        <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
          <span>
            {(+data.costOfSub / 10 ** data.token.decimals).toLocaleString(locale, {
              maximumFractionDigits: 4,
              minimumFractionDigits: 4,
            })}
          </span>{' '}
          {explorerUrl ? (
            <a
              href={`${explorerUrl}/address/${data.token.address}`}
              target="_blank"
              rel="noreferrer noopener"
              className="underline"
            >
              {data.token.symbol}
            </a>
          ) : (
            <span>{data.token.symbol}</span>
          )}
        </td>
        <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
          {Number.isNaN(Number(data.nonRefundableSubs.length)) ? '' : data.nonRefundableSubs.length}
        </td>
        <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
          {formatFrequency(data.duration)}
        </td>
        <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
          {chainId && (
            <Link href={`/subscriptions/${chainId}/${data.id}`} target="_blank" className="flex items-center gap-1">
              <span>Subscribe</span>
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </Link>
          )}
        </td>
        <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
          {data.disabled ? (
            <button
              className="min-w-[5rem] rounded-lg border border-lp-gray-2 bg-lp-gray-1 py-1 px-2 disabled:cursor-not-allowed dark:bg-lp-gray-5"
              disabled
            >
              Disabled
            </button>
          ) : (
            <button
              className="min-w-[5rem] rounded-lg border border-red-500 py-1 px-2 disabled:cursor-not-allowed disabled:border-lp-gray-2 disabled:bg-lp-gray-1 dark:disabled:bg-lp-gray-5"
              disabled={disabled || isLoading || isConfirming}
              onClick={() => removeSub()}
            >
              {isLoading || isConfirming ? <BeatLoader size="4px" className="!h-5" /> : 'Remove'}
            </button>
          )}
        </td>
      </tr>
    </>
  );
};

const Whitelist = ({
  address,
  contractAddress,
  explorerUrl,
  chainId,
  txDialogState,
  txHash,
  disabled,
}: {
  address: string;
  contractAddress: string;
  explorerUrl?: string | null;
  chainId?: number;
  txDialogState: DisclosureState;
  txHash: React.MutableRefObject<string>;
  disabled?: boolean;
}) => {
  const [isConfirming, setIsConfirming] = React.useState(false);

  const { config } = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi: nonRefundableSubscriptionABI,
    chainId,
    functionName: 'removeWhitelist',
    args: [address],
    enabled: !disabled,
  });

  const { isLoading, writeAsync } = useContractWrite(config);

  const queryClient = useQueryClient();

  const removeAddressFromWhitelist = () => {
    if (writeAsync) {
      writeAsync()
        .then((data) => {
          txHash.current = data.hash;

          txDialogState.setOpen(true);

          setIsConfirming(true);

          const toastId = toast.loading('Confirming Transaction');

          data.wait().then((receipt) => {
            if (toastId) {
              toast.dismiss(toastId);
            }
            receipt.status === 1 ? toast.success('Transaction Success') : toast.error('Transaction Failed');
            queryClient.invalidateQueries();
            setIsConfirming(false);
          });
        })
        .catch((err) => {
          toast.error(err.reason || err.message || 'Transaction Failed');
          setIsConfirming(false);
        });
    } else {
      toast.error('Failed to interact with contract');
    }
  };

  return (
    <>
      <tr>
        <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
          {explorerUrl ? (
            <a
              href={`${explorerUrl}/address/${address}`}
              target="_blank"
              rel="noreferrer noopener"
              className="underline"
            >
              {address}
            </a>
          ) : (
            <span>{address}</span>
          )}
        </td>

        <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
          <button
            className="min-w-[5rem] rounded-lg border border-red-500 py-1 px-2 disabled:cursor-not-allowed disabled:border-lp-gray-2 disabled:bg-lp-gray-1 dark:disabled:bg-lp-gray-5"
            disabled={disabled || isLoading || isConfirming}
            onClick={() => removeAddressFromWhitelist()}
          >
            {isLoading || isConfirming ? <BeatLoader size="4px" className="!h-5" /> : 'Remove'}
          </button>
        </td>
      </tr>
    </>
  );
};

const ClaimableBalance = ({
  token,
  contractAddress,
  chainId,
  explorerUrl,
}: {
  token: { address: string; symbol: string; decimals: number };
  contractAddress: string;
  chainId?: number;
  explorerUrl?: string | null;
}) => {
  const [isConfirming, setIsConfirming] = React.useState(false);

  const {
    data: claimableBalance,
    isLoading: isFetchgingBalance,
    refetch: refetchClaimableBalance,
  } = useBalance({
    address: contractAddress as `0x${string}`,
    token: token.address as `0x${string}`,
    chainId,
  });

  const { locale } = useLocale();

  const formattedBalance = claimableBalance
    ? Number(claimableBalance.formatted).toLocaleString(locale, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      })
    : null;

  const claimDialog = useDialogState();

  const { isLoading, writeAsync } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: contractAddress as `0x${string}`,
    abi: nonRefundableSubscriptionABI,
    chainId,
    functionName: 'claim',
  });

  const queryClient = useQueryClient();

  const claimToken = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement & { amount: { value: string } };

    if (writeAsync) {
      writeAsync({
        recklesslySetUnpreparedArgs: [
          token.address,
          new BigNumber(form.amount.value).times(10 ** token.decimals).toFixed(0, 1),
        ],
      })
        .then((data) => {
          setIsConfirming(true);

          data.wait().then((receipt) => {
            refetchClaimableBalance();
            receipt.status === 1 ? toast.success('Transaction Success') : toast.error('Transaction Failed');
            form.reset();
            queryClient.invalidateQueries();
            setIsConfirming(false);
            claimDialog.setOpen(false);
          });
        })
        .catch((err) => {
          toast.error(err.reason || err.message || 'Transaction Failed');
          setIsConfirming(false);
        });
    } else {
      toast.error('Failed to interact with contract');
    }
  };
  const t0 = useTranslations('Common');
  const t1 = useTranslations('Forms');

  return (
    <tr>
      <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
        {formattedBalance && (
          <>
            <span>{formattedBalance}</span>{' '}
            {explorerUrl && claimableBalance ? (
              <a
                href={`${explorerUrl}/address/${token.address}`}
                target="_blank"
                rel="noreferrer noopener"
                className="underline"
              >
                {token.symbol}
              </a>
            ) : null}
          </>
        )}
      </td>

      <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
        <button
          className="w-[4rem] rounded-lg border border-lp-primary py-1 px-2 disabled:cursor-not-allowed"
          disabled={!claimableBalance || isFetchgingBalance || Number(formattedBalance) === 0}
          onClick={claimDialog.toggle}
        >
          Claim
        </button>

        <FormDialog dialog={claimDialog} title={`Claim ${token.symbol}`}>
          <form className="mx-auto my-8 flex flex-col gap-4" onSubmit={claimToken}>
            <div>
              <InputAmount name="amount" label={`${t0('amount')} ${token.symbol}`} isRequired />
              <AvailableAmount
                title={t1('availableForWithdrawl')}
                selectedToken={token as any}
                amount={formattedBalance}
              />
            </div>

            <SubmitButton
              disabled={
                !claimableBalance || isFetchgingBalance || Number(formattedBalance) === 0 || isLoading || isConfirming
              }
              className="mt-2 rounded"
            >
              {isLoading || isFetchgingBalance || isConfirming ? <BeatLoader size="6px" color="white" /> : 'Confirm'}
            </SubmitButton>
          </form>
        </FormDialog>
      </td>
    </tr>
  );
};
