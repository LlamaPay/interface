import { getAddress } from 'ethers/lib/utils';
import { IEnsResolve } from '~/queries/useResolveEns';
import type { IFormattedSalaryStream } from '~/types';
import { createContract } from '~/utils/contract';
import { createERC20Contract } from '~/utils/tokenUtils';
import { Provider } from './useNetworkProvider';
import type { ISalaryStream } from '~/queries/salary/useGetSalaryInfo';

export const formatStream = ({
  stream,
  provider,
  ensData,
  address,
}: {
  stream: ISalaryStream;
  provider: Provider;
  ensData?: IEnsResolve | null | undefined;
  address: string;
}): IFormattedSalaryStream => {
  const streamType: 'outgoingStream' | 'incomingStream' =
    stream.payer.id?.toLowerCase() === address.toLowerCase() ? 'outgoingStream' : 'incomingStream';

  const payerEns =
    ensData && ensData[stream.payer.id.toLowerCase()] !== undefined ? ensData[stream.payer.id.toLowerCase()] : null;
  const payeeEns =
    ensData && ensData[stream.payee.id.toLowerCase()] !== undefined ? ensData[stream.payee.id.toLowerCase()] : null;

  return {
    llamaContractAddress: stream.contract.address,
    amountPerSec: stream.amountPerSec,
    createdTimestamp: stream.createdTimestamp,
    payerAddress: stream.payer.id,
    payerEns: payerEns,
    payeeEns: payeeEns,
    payeeAddress: stream.payee.id,
    streamId: stream.streamId,
    streamType,
    token: stream.token,
    tokenName: stream.token.name,
    tokenSymbol: stream.token.symbol,
    tokenContract: createERC20Contract({ tokenAddress: getAddress(stream.token.address), provider }),
    llamaTokenContract: createContract(getAddress(stream.contract.address), provider),
    historicalEvents: stream.historicalEvents,
    paused: stream.paused,
    pausedAmount: stream.pausedAmount,
    lastPaused: stream.lastPaused,
    reason: stream.reason || null,
  };
};
