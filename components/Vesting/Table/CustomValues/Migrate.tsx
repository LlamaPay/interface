import { useQueryClient } from '@tanstack/react-query';
import { useDialogState } from 'ariakit';
import toast from 'react-hot-toast';
import { BeatLoader } from '~/components/BeatLoader';
import { useAccount, useContractWrite, useProvider } from 'wagmi';
import { FormDialog, TransactionDialog } from '~/components/Dialog';
import { SubmitButton } from '~/components/Form';
import { vestingContractReadableABI } from '~/lib/abis/vestingContractReadable';
import { IVesting } from '~/types';
import { VESTING_FACTORY } from '~/lib/contracts';
import { useApproveToken, useCheckTokenApproval, useGetTokenApproval } from '~/queries/useTokenApproval';
import { checkApproval } from '~/components/Form/utils';
import { networkDetails } from '~/lib/networkDetails';
import { useNetworkProvider } from '~/hooks';
import { createERC20Contract } from '~/utils/tokenUtils';
import { getAddress } from 'ethers/lib/utils.js';
import { getTotalVested } from './Vested';
import BigNumber from 'bignumber.js';
import { vestingFactoryReadableABI } from '~/lib/abis/vestingFactoryReadable';
import { useState } from 'react';

export default function MigrateButton({ data }: { data: IVesting }) {
  const { chainId } = useNetworkProvider();
  const VESTING_FACTORY_V2 = chainId ? networkDetails[chainId]?.vestingFactory_v2 : null;
  if (!VESTING_FACTORY_V2) return null;
  return <MButton data={data} factoryV2={VESTING_FACTORY_V2} />;
}

function MButton({ data, factoryV2 }: { data: IVesting; factoryV2: string }) {
  const { address } = useAccount();

  const totalVested = getTotalVested(data);
  const toVest = new BigNumber(data.totalLocked).minus(totalVested);
  const vestingAmount = toVest.dividedBy(10 ** data.tokenDecimals).toString();
  const provider = useProvider();
  const tokenContract = createERC20Contract({ tokenAddress: getAddress(data.token), provider });
  const isRugPulled = Number(data.disabledAt) < Date.now() / 1e3;

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
    data: isTokenApproved,
    isLoading: fetchingTokenApproval,
    error: errorFetchingTokenApproval,
  } = useGetTokenApproval({
    token: tokenContract,
    userAddress: data.admin,
    approveForAddress: factoryV2,
    approvedForAmount: toVest.toFixed(),
  });
  const isApproved = isTokenApproved || isTokenApproved1;
  const checkingApproval = fetchingTokenApproval || fetchingTokenApproval1;
  const { mutate: approveTokenSpend, isLoading: approvingToken, error: errorApproving } = useApproveToken();
  const { chainId } = useNetworkProvider();
  function approveToken() {
    if (chainId) {
      approveTokenSpend(
        {
          tokenAddress: getAddress(data.token),
          amountToApprove: toVest.toFixed(),
          // TODO update it to networkDetails[chainId].vestingFactory
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
    const now = Date.now() / 1e3;

    let vestingDuration, startTime, cliffTime;

    if (now < +data.startTime) {
      vestingDuration = +data.endTime - +data.startTime;
      startTime = +data.startTime;
      cliffTime = +data.cliffLength;
    } else {
      const endCliff = +data.startTime + +data.cliffLength;
      if (now > endCliff) {
        cliffTime = 0;
        vestingDuration = +data.endTime - now;
        startTime = now;
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
              {checkingApproval || approvingToken ? <BeatLoader size="6px" color="white" /> : 'Approve Token'}
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
              {creatingContract || approvingToken ? <BeatLoader size="6px" color="white" /> : 'Create New Stream'}
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
      </FormDialog>
      <TransactionDialog dialog={transactionDialog} transactionHash={transactionHash} />
    </>
  );
}
