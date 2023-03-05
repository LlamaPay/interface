import { useAccount, useBalance, useContractRead, useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi';
import { networkDetails } from '~/lib/networkDetails';
import type { IRefundable, ITier } from '~/queries/useGetSubscriptions';
import { formatFrequency } from '../ScheduledTransfers/utils';
import { PlusIcon } from '@heroicons/react/24/outline';
import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import Tooltip from '../Tooltip';
import { FormDialog, TransactionDialog } from '../Dialog';
import { SubmitButton } from '../Form';
import { BeatLoader } from '../BeatLoader';
import * as React from 'react';
import { useLocale } from '~/hooks';
import { DisclosureState, useDialogState } from 'ariakit';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { refundableSubscriptionABI } from '~/lib/abis/refundableSubscription';
import { CreateRefundableTier } from './CreateRefundableTier';
import Link from 'next/link';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';

export function RefundableTable({ data, userAddress }: { data: Array<IRefundable>; userAddress: string }) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((contract) => (
        <Contract key={'refundable-subs' + contract.id} data={contract} userAddress={userAddress} />
      ))}
    </div>
  );
}

const Contract = ({ data, userAddress }: { data: IRefundable; userAddress: string }) => {
  const [isConfirming, setIsConfirming] = React.useState(false);

  const { chain } = useNetwork();

  const explorerUrl = chain ? networkDetails[chain.id]?.blockExplorerURL : null;

  const tierDialog = useDialogState();
  const whitelistDialog = useDialogState();
  const txDialogState = useDialogState();
  const txHash = React.useRef('');

  const { isLoading, writeAsync } = useContractWrite({
    address: data.address as `0x${string}`,
    abi: refundableSubscriptionABI,
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

  data.tiers.forEach((tier) => {
    if (!tokens.find((t) => t.address.toLowerCase() === tier.token.address.toLowerCase())) {
      tokens.push(tier.token);
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
                    <Balance
                      key={data.address + token.address + 'nonrefundabletokenbalance'}
                      tokenAddress={token.address}
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
              Duration
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              {formatFrequency(data.periodDuation)}
            </td>
          </tr>
          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Tiers
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                      Cost per period
                    </th>
                    <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
                      Active Subs
                    </th>
                    <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7"></th>
                    <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7"></th>
                  </tr>
                </thead>
                <tbody className="border border-llama-teal-2 dark:border-lp-gray-7">
                  {data.tiers.map((tier) => (
                    <Tier
                      key={tier.id + data.id + 'nonrefundablessub'}
                      data={tier}
                      contractAddress={data.address}
                      chainId={chain?.id}
                      explorerUrl={explorerUrl}
                      txDialogState={txDialogState}
                      txHash={txHash}
                      tierId={tier.tierId}
                      disabled={isNotOwner}
                    />
                  ))}
                </tbody>
              </table>

              <button
                className="mx-auto mt-2 flex flex-nowrap items-center gap-2 rounded-lg border border-lp-primary py-1 px-2 disabled:cursor-not-allowed disabled:border-lp-gray-2 disabled:bg-lp-gray-1 dark:disabled:bg-lp-gray-5"
                onClick={() => tierDialog.setOpen(true)}
                disabled={isNotOwner}
              >
                <PlusIcon className="h-4 w-4" />
                <span>Create Tier</span>
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

      <FormDialog title="Refundable Subscription" dialog={tierDialog} className="h-fit">
        <CreateRefundableTier
          onTxSuccess={() => tierDialog.setOpen(false)}
          contractAddress={data.address}
          chainId={chain?.id}
          period={formatFrequency(data.periodDuation)}
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
    abi: refundableSubscriptionABI,
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
            disabled={isLoading || isConfirming || disabled}
            onClick={() => removeAddressFromWhitelist()}
          >
            {isLoading || isConfirming ? <BeatLoader size="4px" className="!h-5" /> : 'Remove'}
          </button>
        </td>
      </tr>
    </>
  );
};

const Tier = ({
  tierId,
  data,
  contractAddress,
  explorerUrl,
  chainId,
  txDialogState,
  txHash,
  disabled,
}: {
  tierId: string;
  data: ITier;
  explorerUrl?: string | null;
  chainId?: number;
  txDialogState: DisclosureState;
  contractAddress: string;
  txHash: React.MutableRefObject<string>;
  disabled?: boolean;
}) => {
  const [isConfirming, setIsConfirming] = React.useState(false);

  const isDisabled = data.disabledAt && data.disabledAt !== '0';

  const {
    data: tierIndex,
    isLoading: fetchingTierIndex,
    isError: errorFetchingTierIndex,
  } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: refundableSubscriptionABI,
    functionName: 'activeTiers',
    chainId,
    args: [tierId],
  });

  const { config } = usePrepareContractWrite({
    address: contractAddress as `0x${string}`,
    abi: refundableSubscriptionABI,
    chainId,
    functionName: 'removeTiers',
    args: [[tierIndex]],
    enabled: !disabled && !isDisabled && !fetchingTierIndex && !errorFetchingTierIndex && tierIndex ? true : false,
  });

  const { isLoading, writeAsync } = useContractWrite(config);

  const queryClient = useQueryClient();

  const removeTier = () => {
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

  const { locale } = useLocale();

  return (
    <tr>
      <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
        <span>
          {(+data.costPerPeriod / 10 ** data.token.decimals).toLocaleString(locale, {
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
        {Number.isNaN(Number(data.refundableSubs.length)) ? '' : data.refundableSubs.length}
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
        {isDisabled ? (
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
            onClick={() => removeTier()}
          >
            {isLoading || isConfirming ? <BeatLoader size="4px" className="!h-5" /> : 'Remove'}
          </button>
        )}
      </td>
    </tr>
  );
};

const Balance = ({
  tokenAddress,
  contractAddress,
  chainId,
  explorerUrl,
}: {
  tokenAddress: string;
  contractAddress: string;
  chainId?: number;
  explorerUrl?: string | null;
}) => {
  const { data: balance } = useBalance({
    address: contractAddress as `0x${string}`,
    token: tokenAddress as `0x${string}`,
    chainId,
  });

  const { locale } = useLocale();

  const formattedBalance = balance?.formatted
    ? Number(balance.formatted).toLocaleString(locale, {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      })
    : null;

  return (
    <tr>
      <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
        {formattedBalance && (
          <>
            <span>{formattedBalance}</span>{' '}
            {explorerUrl && balance ? (
              <a
                href={`${explorerUrl}/address/${tokenAddress}`}
                target="_blank"
                rel="noreferrer noopener"
                className="underline"
              >
                {balance.symbol}
              </a>
            ) : null}
          </>
        )}
      </td>

      <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
        {/* <button
          className="w-[4rem] rounded-lg border border-lp-primary py-1 px-2 disabled:cursor-not-allowed"
          disabled={Number(formattedBalance) === 0}
        >
          Claim
        </button> */}
      </td>
    </tr>
  );
};
