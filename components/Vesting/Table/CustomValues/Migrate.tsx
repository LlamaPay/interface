import { useQueryClient } from '@tanstack/react-query';
import { useDialogState } from 'ariakit';
import toast from 'react-hot-toast';
import { BeatLoader } from '~/components/BeatLoader';
import { erc20ABI, useAccount, useContractWrite, useProvider } from 'wagmi';
import { FormDialog, TransactionDialog } from '~/components/Dialog';
import { SubmitButton } from '~/components/Form';
import { vestingContractReadableABI } from '~/lib/abis/vestingContractReadable';
import { IVesting } from '~/types';
import { VESTING_FACTORY } from '~/lib/contracts';
import {
  useApproveToken,
  useCheckTokenApproval,
  useGetTokenApprovalRaw,
  useGetTokenApprovals,
} from '~/queries/useTokenApproval';
import { checkApproval } from '~/components/Form/utils';
import { networkDetails } from '~/lib/networkDetails';
import { useNetworkProvider } from '~/hooks';
import { createERC20Contract } from '~/utils/tokenUtils';
import { getAddress } from 'ethers/lib/utils.js';
import { getTotalVested } from './Vested';
import BigNumber from 'bignumber.js';
import { vestingFactoryReadableABI } from '~/lib/abis/vestingFactoryReadable';
import { useState } from 'react';
import useGnosisBatch from '~/queries/useGnosisBatch';
import { Interface } from 'ethers/lib/utils';

const DAY = 3600 * 24;

export default function MigrateButton({ data, allStreams }: { data: IVesting; allStreams: Array<IVesting> }) {
  const { chainId } = useNetworkProvider();
  const VESTING_FACTORY_V2 = chainId ? networkDetails[chainId]?.vestingFactory_v2 : null;
  const migratedStream = allStreams.find(
    (stream) =>
      data.contract !== stream.contract &&
      stream.admin === data.admin &&
      stream.recipient === data.recipient &&
      stream.token === data.token &&
      stream.endTime === data.endTime &&
      (data.disabledAt === stream.startTime || data.startTime === stream.startTime)
  );

  if (!VESTING_FACTORY_V2 || migratedStream) return null;

  return <MButton data={data} factoryV2={VESTING_FACTORY_V2} />;
}

function getActualVested(data: IVesting) {
  const now = Date.now() / 1e3;
  const cliffEnd = Number(data.startTime) + Number(data.cliffLength);
  if (now < cliffEnd) {
    return 0;
  }
  return getTotalVested(data);
}

function MButton({ data, factoryV2 }: { data: IVesting; factoryV2: string }) {
  const { address } = useAccount();

  const totalVested = getActualVested(data);
  const toVest = new BigNumber(data.totalLocked).minus(totalVested);
  const vestingAmount = toVest.dividedBy(10 ** data.tokenDecimals).toString();
  const provider = useProvider();
  const tokenContract = createERC20Contract({ tokenAddress: getAddress(data.token), provider });
  const isRugPulled = Number(data.disabledAt) < Date.now() / 1e3;

  const timeTillCliffEnd =
    data.cliffLength === '0' ? null : Number(data.startTime) + Number(data.cliffLength) - Date.now() / 1e3;

  const migrateDialog = useDialogState();

  const queryClient = useQueryClient();

  // cancel existing stream
  const {
    writeAsync: rug_pull,
    isLoading: isCancellingStream,
    error: errorCancelling,
  } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: data.contract as `0x${string}`,
    abi: vestingContractReadableABI,
    functionName: 'rug_pull',
  });
  function rugPull() {
    rug_pull()
      .then((data) => {
        const toastid = toast.loading('Rugging');
        data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Cancelled Stream') : toast.error('Failed to Cancel');
          queryClient.invalidateQueries();
        });
      })
      .catch((err) => {
        toast.error(err.reason || err.message || 'Transaction Failed');
      });
  }

  // approve token spend to create new stream
  const {
    mutate: checkTokenApproval,
    data: isTokenApproved1,
    isLoading: fetchingTokenApproval1,
    error: errorCheckingApproval,
  } = useCheckTokenApproval();
  const {
    data: tokenApprovalAmount,
    isLoading: fetchingTokenApproval,
    error: errorFetchingTokenApproval,
  } = useGetTokenApprovalRaw({
    token: tokenContract,
    userAddress: data.admin,
    approveForAddress: factoryV2,
  });

  const isApproved = new BigNumber(tokenApprovalAmount).gte(toVest) || isTokenApproved1;
  const checkingApproval = fetchingTokenApproval || fetchingTokenApproval1;
  const { mutate: approveTokenSpend, isLoading: approvingToken, error: errorApproving } = useApproveToken();
  const { chainId } = useNetworkProvider();
  function approveToken() {
    if (chainId) {
      approveTokenSpend(
        {
          tokenAddress: getAddress(data.token),
          amountToApprove: toVest.toFixed(),
          spenderAddress: factoryV2,
        },
        {
          onSettled: () => {
            // llamacontractAddress is approveForAddress
            checkApproval({
              tokenDetails: {
                tokenContract,
                llamaContractAddress: factoryV2,
                decimals: data.tokenDecimals,
              },
              userAddress: address,
              approvedForAmount: vestingAmount,
              checkTokenApproval,
            });
          },
        }
      );
    }
  }

  // create new stream
  const [transactionHash, setTransactionHash] = useState<string>('');
  const transactionDialog = useDialogState();
  const { writeAsync: deploy_vesting_contract, isLoading: creatingContract } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: factoryV2 as `0x${string}`,
    abi: vestingFactoryReadableABI,
    functionName: 'deploy_vesting_contract',
  });
  function createStream() {
    let vestingDuration, startTime, cliffTime;
    if (data.disabledAt == data.endTime) {
      throw new Error('stream has not been revoked');
    }

    if (+data.disabledAt < +data.startTime) {
      vestingDuration = +data.endTime - +data.startTime;
      startTime = +data.startTime;
      cliffTime = +data.cliffLength;
    } else {
      const endCliff = +data.startTime + +data.cliffLength;
      if (+data.disabledAt >= endCliff) {
        cliffTime = 0;
        vestingDuration = +data.endTime - +data.disabledAt;
        startTime = +data.disabledAt;
      } else {
        // keep everything the same
        cliffTime = +data.cliffLength;
        vestingDuration = +data.endTime - +data.startTime;
        startTime = +data.startTime;
      }
    }

    deploy_vesting_contract({
      recklesslySetUnpreparedArgs: [
        data.token,
        data.recipient,
        toVest.toFixed(),
        vestingDuration.toFixed(0),
        startTime.toFixed(0),
        cliffTime.toFixed(0),
        false,
      ],
    })
      .then((tx) => {
        const toastid = toast.loading('Creating Contract');
        setTransactionHash(tx.hash);
        migrateDialog.hide();
        transactionDialog.show();
        tx.wait().then((receipt) => {
          toast.dismiss(toastid);
          if (receipt.status === 1) {
            toast.success('Successfuly Created Contract');
          } else {
            toast.error('Failed to Create Contract');
          }
          queryClient.invalidateQueries();
        });
      })
      .catch((err) => {
        toast.error(err.reason || err.message || 'Transaction Failed');
      });
  }

  return (
    <>
      {address &&
      data.admin.toLowerCase() === address.toLowerCase() &&
      data.factory.toLowerCase() === VESTING_FACTORY.toLowerCase() ? (
        <button onClick={() => migrateDialog.show()} className="row-action-links font-exo float-right dark:text-white">
          Migrate
        </button>
      ) : null}
      <FormDialog className="h-min" dialog={migrateDialog} title={'Migrate Stream'}>
        <ol className="flex list-decimal flex-col pl-5">
          <li>
            <SubmitButton
              className="mt-5 disabled:opacity-60"
              onClick={rugPull}
              disabled={isCancellingStream || isRugPulled}
            >
              {isCancellingStream ? <BeatLoader size="6px" color="white" /> : 'Stop Current Stream'}
            </SubmitButton>
          </li>
          <li>
            <SubmitButton
              className="mt-5 disabled:opacity-60"
              onClick={approveToken}
              disabled={checkingApproval || approvingToken || !isRugPulled || isApproved}
            >
              {approvingToken ? <BeatLoader size="6px" color="white" /> : 'Approve Token'}
            </SubmitButton>
          </li>
          <li>
            <SubmitButton
              className="mt-5 disabled:opacity-60"
              onClick={createStream}
              disabled={
                creatingContract || approvingToken || !isRugPulled || !isApproved || +data.endTime <= Date.now() / 1e3
              }
            >
              {creatingContract ? <BeatLoader size="6px" color="white" /> : 'Create New Stream'}
            </SubmitButton>
          </li>
        </ol>

        {errorCancelling ? (
          <p className="my-2 break-all text-center text-sm text-red-500">{`[CANCEL-STREAM]: ${
            errorCancelling?.message ?? 'Failed to cancel'
          }`}</p>
        ) : null}
        {errorApproving ? (
          <p className="my-2 break-all text-center text-sm text-red-500">{`[TOKEN_APPROVAL]: ${
            errorApproving?.message ?? 'Failed to approve'
          }`}</p>
        ) : null}
        {errorCheckingApproval ? (
          <p className="my-2 break-all text-center text-sm text-red-500">{`[CHECK_TOKEN_APPROVAL_1]: ${
            (errorCheckingApproval instanceof Error ? errorCheckingApproval.message : null) ??
            'Failed to check approval'
          }`}</p>
        ) : null}
        {errorFetchingTokenApproval ? (
          <p className="my-2 break-all text-center text-sm text-red-500">{`[CHECK_TOKEN_APPROVAL]: ${
            (errorFetchingTokenApproval instanceof Error ? errorFetchingTokenApproval.message : null) ??
            'Failed to check approval'
          }`}</p>
        ) : null}
        {timeTillCliffEnd !== null && timeTillCliffEnd < 7 * DAY ? (
          <p>
            <br />
            You must make sure that these 3 txs are executed within {(timeTillCliffEnd / DAY).toFixed(2)} days
          </p>
        ) : null}
      </FormDialog>
      <TransactionDialog dialog={transactionDialog} transactionHash={transactionHash} />
    </>
  );
}

export const MigrateAll = ({ data, factoryV2 }: { data: Array<IVesting>; factoryV2: string }) => {
  const { mutate: rugPullBatch, isLoading: isRugpulling, error: errorRugpulling } = useGnosisBatch();
  const { mutate: migrateBatch, isLoading: isMigrating, error: errorMigrating } = useGnosisBatch();

  const migrateDialog = useDialogState();

  const streamsToRugpull = data.filter((stream) => !(Number(stream.disabledAt) < Date.now() / 1e3));

  const rugPull = () => {
    const calls: { [key: string]: string[] } = {};
    streamsToRugpull.forEach((stream) => {
      calls[stream.contract] = [new Interface(vestingContractReadableABI).encodeFunctionData('rug_pull')];
    });
    rugPullBatch({ calls });
  };

  const toVestByTokens = data.reduce((acc, curr) => {
    const totalVested = getActualVested(curr);
    const toVest = new BigNumber(curr.totalLocked).minus(totalVested);
    acc[curr.token] = (acc[curr.token] ?? new BigNumber(0)).plus(toVest);
    return acc;
  }, {} as Record<string, BigNumber>);

  const {
    data: tokenApprovalAmount,
    isLoading: fetchingTokenApproval,
    error: errorFetchingTokenApproval,
  } = useGetTokenApprovals({
    tokens: Object.keys(toVestByTokens),
    userAddress: data[0].admin,
    approveForAddress: factoryV2,
  });

  const calls: any = { approve: [], create: [] };
  if (tokenApprovalAmount) {
    // token approve calls based on current allowance
    for (const tokenToVest in toVestByTokens) {
      const isApproved = new BigNumber(tokenApprovalAmount[tokenToVest].toString()).gte(toVestByTokens[tokenToVest]);

      if (!isApproved) {
        const amountToApprove = new BigNumber(toVestByTokens[tokenToVest]).minus(
          tokenApprovalAmount[tokenToVest].toString()
        );

        calls.approve.push([data[0].admin, amountToApprove.toFixed()]);
      }
    }
    // calls to migrate streams to v2
    data.forEach((oldStream) => {
      let vestingDuration, startTime, cliffTime;

      if (+oldStream.disabledAt < +oldStream.startTime) {
        vestingDuration = +oldStream.endTime - +oldStream.startTime;
        startTime = +oldStream.startTime;
        cliffTime = +oldStream.cliffLength;
      } else {
        const endCliff = +oldStream.startTime + +oldStream.cliffLength;
        if (+oldStream.disabledAt >= endCliff) {
          cliffTime = 0;
          vestingDuration = +oldStream.endTime - +oldStream.disabledAt;
          startTime = +oldStream.disabledAt;
        } else {
          // keep everything the same
          cliffTime = +oldStream.cliffLength;
          vestingDuration = +oldStream.endTime - +oldStream.startTime;
          startTime = +oldStream.startTime;
        }
      }

      const totalVested = getActualVested(oldStream);
      const toVest = new BigNumber(oldStream.totalLocked).minus(totalVested);
      calls.create.push([
        oldStream.token,
        oldStream.recipient,
        toVest.toFixed(),
        vestingDuration.toFixed(0),
        startTime.toFixed(0),
        cliffTime.toFixed(0),
        false,
      ]);
    });
  }
  console.log({ data, toVestByTokens, tokenApprovalAmount, calls });
  const createStream = () => {
    if (!tokenApprovalAmount || data.find((stream) => stream.disabledAt == stream.endTime)) return;

    const calls: { [key: string]: string[] } = {};
    // token approve calls based on current allowance
    for (const tokenToVest in toVestByTokens) {
      const isApproved = new BigNumber(tokenApprovalAmount[tokenToVest].toString()).gte(toVestByTokens[tokenToVest]);

      if (!isApproved) {
        const amountToApprove = new BigNumber(toVestByTokens[tokenToVest]).minus(
          tokenApprovalAmount[tokenToVest].toString()
        );

        calls[tokenToVest] = [
          new Interface(erc20ABI).encodeFunctionData('approve', [data[0].admin, amountToApprove.toFixed()]),
        ];
      }
    }
    // calls to migrate streams to v2
    calls[factoryV2] = data.map((oldStream) => {
      let vestingDuration, startTime, cliffTime;

      if (+oldStream.disabledAt < +oldStream.startTime) {
        vestingDuration = +oldStream.endTime - +oldStream.startTime;
        startTime = +oldStream.startTime;
        cliffTime = +oldStream.cliffLength;
      } else {
        const endCliff = +oldStream.startTime + +oldStream.cliffLength;
        if (+oldStream.disabledAt >= endCliff) {
          cliffTime = 0;
          vestingDuration = +oldStream.endTime - +oldStream.disabledAt;
          startTime = +oldStream.disabledAt;
        } else {
          // keep everything the same
          cliffTime = +oldStream.cliffLength;
          vestingDuration = +oldStream.endTime - +oldStream.startTime;
          startTime = +oldStream.startTime;
        }
      }

      const totalVested = getActualVested(oldStream);
      const toVest = new BigNumber(oldStream.totalLocked).minus(totalVested);

      return new Interface(vestingFactoryReadableABI).encodeFunctionData('deploy_vesting_contract', [
        oldStream.token,
        oldStream.recipient,
        toVest.toFixed(),
        vestingDuration.toFixed(0),
        startTime.toFixed(0),
        cliffTime.toFixed(0),
        false,
      ]);
    });

    migrateBatch({ calls });
  };

  return (
    <>
      <button className="secondary-button text-md py-2 px-5 text-center font-bold" onClick={migrateDialog.toggle}>
        Migrate All
      </button>
      <FormDialog className="h-min" dialog={migrateDialog} title={'Migrate Streams'}>
        <ol>
          <li>
            <SubmitButton
              className="mt-5 disabled:opacity-60"
              onClick={rugPull}
              disabled={isRugpulling || streamsToRugpull.length === 0}
            >
              {isRugpulling ? <BeatLoader size="6px" color="white" /> : 'Stop current v1 streams'}
            </SubmitButton>
          </li>
          <li>
            <SubmitButton
              className="mt-5 disabled:opacity-60"
              onClick={createStream}
              disabled={fetchingTokenApproval || isMigrating || streamsToRugpull.length !== 0}
            >
              {isMigrating ? <BeatLoader size="6px" color="white" /> : 'Migrate to v2 streams'}
            </SubmitButton>
          </li>
        </ol>
        {errorRugpulling ? (
          <p className="my-2 break-all text-center text-sm text-red-500">
            {`[CANCEL-STREAM]: ${(errorRugpulling as any).message ?? 'Failed to cancel'}`}
          </p>
        ) : null}
        {errorMigrating ? (
          <p className="my-2 break-all text-center text-sm text-red-500">
            {`[MIGRATE-STREAM]: ${(errorMigrating as any).message ?? 'Failed to migrate'}`}
          </p>
        ) : null}
        {errorFetchingTokenApproval ? (
          <p className="my-2 break-all text-center text-sm text-red-500">{`[CHECK_TOKEN_APPROVAL]: ${
            (errorFetchingTokenApproval instanceof Error ? errorFetchingTokenApproval.message : null) ??
            'Failed to check approval'
          }`}</p>
        ) : null}
      </FormDialog>
    </>
  );
};
