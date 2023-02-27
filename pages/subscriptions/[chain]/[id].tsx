import { dehydrate, QueryClient, useQueryClient } from '@tanstack/react-query';
import { useDialogState } from 'ariakit';
import BigNumber from 'bignumber.js';
import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import { toast } from 'react-hot-toast';
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useSwitchNetwork,
} from 'wagmi';
import { BeatLoader } from '~/components/BeatLoader';
import { TransactionDialog } from '~/components/Dialog';
import Layout from '~/components/Layout';
import { formatFrequency } from '~/components/ScheduledTransfers/utils';
import { WalletSelector } from '~/components/Web3';
import useDebounce from '~/hooks/useDebounce';
import { nonRefundableSubscriptionABI } from '~/lib/abis/nonRefundableSubscription';
import { refundableSubscriptionABI } from '~/lib/abis/refundableSubscription';
import { networkDetails } from '~/lib/networkDetails';
import {
  fetchSubscriptionContract,
  ISubWithContractInfo,
  ITierWithContractInfo,
  useGetSubscriptionContract,
} from '~/queries/useGetSubscriptions';
import { chainDetails } from '~/utils/network';

interface IProps {
  subgraphEndpoint: string;
  id: string;
  chainId: number;
}

const Home: NextPage<IProps> = ({ subgraphEndpoint, id, chainId }) => {
  const { data, isLoading } = useGetSubscriptionContract({ graphEndpoint: subgraphEndpoint, contractId: id });

  const explorerUrl = networkDetails[chainId]?.blockExplorerURL;

  return (
    <Layout className="max-w-xl">
      {isLoading ? (
        <BeatLoader size="6px" />
      ) : data ? (
        <>
          <>{data.sub && <Sub data={data.sub} explorerUrl={explorerUrl} chainId={chainId} />}</>
          <>{data.tier && <Tier data={data.tier} explorerUrl={explorerUrl} chainId={chainId} />}</>
        </>
      ) : null}
    </Layout>
  );
};

const Tier = ({
  data,
  explorerUrl,
  chainId,
}: {
  data: ITierWithContractInfo;
  explorerUrl: string;
  chainId: number;
}) => {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const walletDialog = useDialogState();

  const [periodDurationNumber, setPeriodDurationNumber] = React.useState('');

  const dbPeriodDurationNumber = useDebounce(periodDurationNumber, 300);

  const amountToSpend =
    dbPeriodDurationNumber && dbPeriodDurationNumber !== ''
      ? new BigNumber(new BigNumber(dbPeriodDurationNumber).div(data.refundableContract.periodDuation))
          .times(data.costPerPeriod)
          .toFixed(0, 1)
      : null;

  const {
    data: allowance,
    isLoading: fetchingAllowance,
    refetch: refetchAllowance,
    isRefetching: isRefetchingAllowance,
  } = useContractRead({
    address: data.token.address as `0x${string}`,
    abi: erc20ABI,
    chainId,
    functionName: 'allowance',
    args: [address as `0x${string}`, data.refundableContract.address as `0x${string}`],
    enabled: amountToSpend ? true : false,
  });

  const isApprovedForAll =
    allowance && amountToSpend && new BigNumber(Number(allowance)).gte(amountToSpend) ? true : false;

  const { config: allowanceConfig } = usePrepareContractWrite({
    address: data.token.address as `0x${string}`,
    abi: erc20ABI,
    chainId,
    functionName: 'approve',
    args: [data.refundableContract.address as `0x${string}`, amountToSpend as any],
    enabled: amountToSpend && !isApprovedForAll && !fetchingAllowance ? true : false,
  });

  const { isLoading: settingApprovalForAll, writeAsync: setTokenApproval } = useContractWrite(allowanceConfig);

  const approveTokenSpend = () => {
    if (setTokenApproval) {
      setTokenApproval()
        .then((data) => {
          setIsConfirming(true);

          data.wait().then((receipt) => {
            receipt.status === 1 ? refetchAllowance() : toast.error('Transaction Failed');
            refetchAllowance();
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

  const { config } = usePrepareContractWrite({
    address: data.refundableContract.address as `0x${string}`,
    abi: refundableSubscriptionABI,
    chainId,
    functionName: 'subscribe',
    args: [address, data.tierId, dbPeriodDurationNumber],
    enabled: isApprovedForAll && dbPeriodDurationNumber ? true : false,
  });

  const { isLoading, writeAsync: subscribeToTier } = useContractWrite(config);

  const queryClient = useQueryClient();

  const txDialogState = useDialogState();
  const txHash = React.useRef('');

  const subscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (subscribeToTier) {
      subscribeToTier()
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
    <div className="section-header ml-0 max-w-fit">
      <h1 className="font-exo text-center">Refundable Subscription</h1>
      <table className="w-full border-collapse">
        <tbody className="border border-llama-teal-2 dark:border-lp-gray-7">
          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Contract
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center font-normal text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              <a
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
                href={`${explorerUrl}/address/${data.refundableContract.address}`}
              >
                {data.refundableContract.address}
              </a>
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Owner
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center font-normal text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              <a
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
                href={`${explorerUrl}/address/${data.refundableContract.owner.address}`}
              >
                {data.refundableContract.owner.address}
              </a>
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Period Duration
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center font-normal text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              {formatFrequency(data.refundableContract.periodDuation)}
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Cost per period
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center font-normal text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              <span>{data.costPerPeriod}</span>{' '}
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
          </tr>
        </tbody>
      </table>

      <form onSubmit={subscribe} className="mt-4 flex flex-col gap-4">
        <label>
          <span className="input-label dark:text-white">Subscription Period</span>

          <div className="flex flex-col gap-1">
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
              value={periodDurationNumber}
              onChange={(e) => setPeriodDurationNumber(e.target.value)}
              required
            />
            <small className="min-h-[1.5rem] w-full rounded p-1 text-xs">
              {Number.isNaN(Number(dbPeriodDurationNumber)) || Number(dbPeriodDurationNumber) === 0
                ? ''
                : formatFrequency(
                    (Number(dbPeriodDurationNumber) * Number(data.refundableContract.periodDuation)).toString()
                  )}
            </small>
          </div>
        </label>

        {data.disabledAt && data.disabledAt !== '0' ? (
          <button
            className="mx-auto w-full cursor-not-allowed rounded border border-lp-gray-2 bg-lp-gray-1 bg-opacity-20 py-2 px-4 text-center text-sm dark:bg-lp-gray-5"
            type="button"
          >
            Tier Disabled
          </button>
        ) : !isConnected || !chain ? (
          <button
            className="mx-auto w-full rounded border border-lp-primary bg-lp-primary py-2 px-4 text-center text-sm text-white disabled:cursor-not-allowed dark:text-black"
            onClick={walletDialog.toggle}
            type="button"
          >
            Connect Wallet
          </button>
        ) : chain.id !== chainId || chain.unsupported ? (
          <button
            className="mx-auto w-full rounded border border-lp-primary bg-lp-primary py-2 px-4 text-center text-sm text-white disabled:cursor-not-allowed dark:text-black"
            onClick={() => switchNetwork?.(chainId)}
            type="button"
          >
            Switch Network
          </button>
        ) : fetchingAllowance || settingApprovalForAll || isLoading || isConfirming || isRefetchingAllowance ? (
          <button
            className="mx-auto w-full rounded border border-lp-primary bg-lp-primary py-2 px-4 text-center text-sm disabled:cursor-not-allowed"
            disabled
            type="button"
          >
            <BeatLoader className="h-[20px]" color="white" />
          </button>
        ) : !isApprovedForAll ? (
          <button
            className="mx-auto w-full rounded border border-lp-primary bg-lp-primary py-2 px-4 text-center text-sm text-white disabled:cursor-not-allowed dark:text-black"
            onClick={approveTokenSpend}
            type="button"
          >
            Approve Token Spend
          </button>
        ) : (
          <button className="mx-auto w-full rounded border border-lp-primary bg-lp-primary py-2 px-4 text-center text-sm text-white disabled:cursor-not-allowed dark:text-black">
            Subscribe
          </button>
        )}
      </form>

      <WalletSelector dialog={walletDialog} />
      <TransactionDialog dialog={txDialogState} transactionHash={txHash.current || ''} />
    </div>
  );
};

const Sub = ({ data, explorerUrl, chainId }: { data: ISubWithContractInfo; explorerUrl: string; chainId: number }) => {
  const [isConfirming, setIsConfirming] = React.useState(false);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const walletDialog = useDialogState();
  const queryClient = useQueryClient();
  const txDialogState = useDialogState();
  const txHash = React.useRef('');

  const {
    data: allowance,
    isLoading: fetchingAllowance,
    refetch: refetchAllowance,
    isRefetching: isRefetchingAllowance,
  } = useContractRead({
    address: data.token.address as `0x${string}`,
    abi: erc20ABI,
    chainId,
    functionName: 'allowance',
    args: [address as `0x${string}`, data.nonRefundableContract.address as `0x${string}`],
  });

  const isApprovedForAll = allowance && new BigNumber(Number(allowance)).gte(data.costOfSub) ? true : false;

  const { config: allowanceConfig } = usePrepareContractWrite({
    address: data.token.address as `0x${string}`,
    abi: erc20ABI,
    chainId,
    functionName: 'approve',
    args: [data.nonRefundableContract.address as `0x${string}`, data.costOfSub as any],
    enabled: !isApprovedForAll && !fetchingAllowance ? true : false,
  });

  const { isLoading: settingApprovalForAll, writeAsync: setTokenApproval } = useContractWrite(allowanceConfig);

  const approveTokenSpend = () => {
    if (setTokenApproval) {
      setTokenApproval()
        .then((data) => {
          setIsConfirming(true);

          data.wait().then((receipt) => {
            receipt.status === 1 ? refetchAllowance() : toast.error('Transaction Failed');
            refetchAllowance();
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

  const { config } = usePrepareContractWrite({
    address: data.nonRefundableContract.address as `0x${string}`,
    abi: nonRefundableSubscriptionABI,
    chainId,
    functionName: 'subscribe',
    args: [address, data.subId],
    enabled: isApprovedForAll ? true : false,
  });

  const { isLoading, writeAsync: subscribeToSub } = useContractWrite(config);

  const subscribe = () => {
    if (subscribeToSub) {
      subscribeToSub()
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
    <div className="section-header ml-0 max-w-fit">
      <h1 className="font-exo text-center">Non Refundable Subscription</h1>
      <table className="w-full border-collapse">
        <tbody className="border border-llama-teal-2 dark:border-lp-gray-7">
          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Contract
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center font-normal text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              <a
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
                href={`${explorerUrl}/address/${data.nonRefundableContract.address}`}
              >
                {data.nonRefundableContract.address}
              </a>
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Owner
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center font-normal text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              <a
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
                href={`${explorerUrl}/address/${data.nonRefundableContract.owner.address}`}
              >
                {data.nonRefundableContract.owner.address}
              </a>
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Period Duration
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center font-normal text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              {formatFrequency(data.duration)}
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Cost per period
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center font-normal text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              <span>{data.costOfSub}</span>{' '}
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
          </tr>
        </tbody>
      </table>

      <div className="mt-4">
        {data.disabled ? (
          <button className="mx-auto w-full cursor-not-allowed rounded border border-lp-gray-2 bg-lp-gray-1 bg-opacity-20 py-2 px-4 text-center text-sm dark:bg-lp-gray-5">
            Tier Disabled
          </button>
        ) : !isConnected || !chain ? (
          <button
            className="mx-auto w-full rounded border border-lp-primary bg-lp-primary py-2 px-4 text-center text-sm text-white disabled:cursor-not-allowed dark:text-black"
            onClick={walletDialog.toggle}
          >
            Connect Wallet
          </button>
        ) : chain.id !== chainId || chain.unsupported ? (
          <button
            className="mx-auto w-full rounded border border-lp-primary bg-lp-primary py-2 px-4 text-center text-sm text-white disabled:cursor-not-allowed dark:text-black"
            onClick={() => switchNetwork?.(chainId)}
          >
            Switch Network
          </button>
        ) : fetchingAllowance || settingApprovalForAll || isLoading || isConfirming || isRefetchingAllowance ? (
          <button
            className="mx-auto w-full rounded border border-lp-primary bg-lp-primary py-2 px-4 text-center text-sm disabled:cursor-not-allowed"
            disabled
          >
            <BeatLoader className="h-[20px]" color="white" />
          </button>
        ) : !isApprovedForAll ? (
          <button
            className="mx-auto w-full rounded border border-lp-primary bg-lp-primary py-2 px-4 text-center text-sm text-white disabled:cursor-not-allowed dark:text-black"
            onClick={approveTokenSpend}
          >
            Approve Token Spend
          </button>
        ) : (
          <button
            className="mx-auto w-full rounded border border-lp-primary bg-lp-primary py-2 px-4 text-center text-sm text-white disabled:cursor-not-allowed dark:text-black"
            onClick={() => subscribe()}
          >
            Subscribe
          </button>
        )}
      </div>
      <WalletSelector dialog={walletDialog} />
      <TransactionDialog dialog={txDialogState} transactionHash={txHash.current || ''} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const { network, chain } = chainDetails(query.chain);

  if (typeof query.chain !== 'string' || typeof query.id !== 'string' || !chain?.id || !network?.subgraphEndpoint) {
    return { notFound: true };
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['subscriptionContracts', query.id, network.subgraphEndpoint],
    queryFn: () =>
      fetchSubscriptionContract({ graphEndpoint: network.subscriptionsSubgraph, contractId: query.id as string }),
  });

  // Pass data to the page via props
  return {
    props: {
      subgraphEndpoint: network?.subgraphEndpoint ?? '',
      id: query.id,
      chainId: chain.id,
      dehydratedState: dehydrate(queryClient),
      messages: (await import(`translations/${locale}.json`)).default,
    },
  };
};

export default Home;
