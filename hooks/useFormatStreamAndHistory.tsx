import { getAddress } from 'ethers/lib/utils';
import * as React from 'react';
import { StreamAndHistoryQuery } from 'services/generated/graphql';
import { IStreamAndHistory } from 'types';
import { createContract } from 'utils/contract';
import { createERC20Contract } from 'utils/tokenUtils';
import { Provider } from './useNetworkProvider';

export function useFormatStreamAndHistory({
  data,
  address,
  provider,
  incomingStreams,
}: {
  data?: StreamAndHistoryQuery;
  address?: string;
  provider: Provider | null;
  incomingStreams?: boolean;
}): IStreamAndHistory {
  return React.useMemo(() => {
    if (provider && data && address) {
      const streams = data?.user?.streams ?? [];
      const history = data?.user?.historicalEvents ?? [];

      const formattedStreams = streams.map((s) => {
        const streamType: 'outgoingStream' | 'incomingStream' =
          s.payer.id?.toLowerCase() === address.toLowerCase() ? 'outgoingStream' : 'incomingStream';

        return {
          llamaContractAddress: s.contract.address,
          amountPerSec: s.amountPerSec,
          createdTimestamp: s.createdTimestamp,
          payerAddress: s.payer.id,
          payeeAddress: s.payee.id,
          streamId: s.streamId,
          streamType,
          token: s.token,
          tokenName: s.token.name,
          tokenSymbol: s.token.symbol,
          tokenContract: createERC20Contract({ tokenAddress: getAddress(s.token.address), provider }),
          llamaTokenContract: createContract(getAddress(s.contract.address), provider),
          historicalEvents: s.historicalEvents,
          paused: s.paused,
          pausedAmount: s.pausedAmount,
          lastPaused: s.lastPaused,
          reason: s.reason ?? s.reason,
        };
      });

      if (incomingStreams) {
        const data = formattedStreams?.filter((s) => s.streamType === 'incomingStream') ?? [];
        return {
          streams: data.length > 0 ? data : null,
          history: null,
        };
      }

      const formattedHistory = history.map((h) => {
        const addressType: 'payer' | 'payee' =
          h.stream?.payer?.id?.toLowerCase() === address.toLowerCase() ? 'payer' : 'payee';

        const addressRelated = addressType === 'payer' ? h.stream?.payee?.id ?? null : h.stream?.payer?.id ?? null;

        return {
          ...h,
          amountPerSec: h.stream?.amountPerSec ?? null,
          addressRelated,
          addressType,
        };
      });

      return {
        streams: formattedStreams.length > 0 ? formattedStreams : null,
        history: formattedHistory.length > 0 ? formattedHistory : null,
      };
    } else return { streams: null, history: null };
  }, [data, provider, address, incomingStreams]);
}
