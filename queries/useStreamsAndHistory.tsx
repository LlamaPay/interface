import * as React from 'react';
import { getAddress } from 'ethers/lib/utils';
import { useGraphEndpoint, useNetworkProvider } from 'hooks';
import { useStreamAndHistoryQuery } from 'services/generated/graphql';
import { createContract } from 'utils/contract';
import { createERC20Contract } from 'utils/tokenUtils';
import { useAccount } from 'wagmi';
import { IStreamAndHistory } from 'types';

const useStreamsAndHistory = () => {
  const [{ data: accountData }] = useAccount();
  const { provider, network } = useNetworkProvider();

  // get subgraph endpoint
  const endpoint = useGraphEndpoint();

  const { data, isLoading, error } = useStreamAndHistoryQuery(
    {
      endpoint,
    },
    {
      id: accountData?.address.toLowerCase() ?? '',
      network: network || '',
    },
    {
      refetchInterval: 10000,
    }
  );

  const formattedData: IStreamAndHistory = React.useMemo(() => {
    if (provider && data) {
      const streams = data?.user?.streams ?? [];
      const history = data?.user?.historicalEvents ?? [];

      const formattedStreams = streams.map((s) => {
        const streamType: 'outgoingStream' | 'incomingStream' =
          s.payer.id?.toLowerCase() === accountData?.address.toLowerCase() ? 'outgoingStream' : 'incomingStream';

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
        };
      });

      const formattedHistory = history.map((h) => {
        const addressType: 'payer' | 'payee' =
          h.stream?.payer?.id?.toLowerCase() === accountData?.address.toLowerCase() ? 'payer' : 'payee';

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
  }, [data, provider, accountData]);

  return React.useMemo(() => ({ data: formattedData, isLoading, error }), [formattedData, isLoading, error]);
};

export default useStreamsAndHistory;
