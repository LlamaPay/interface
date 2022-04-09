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
    }
  );

  const formattedData: IStreamAndHistory = React.useMemo(() => {
    if (provider && data) {
      const streams = data?.user?.streams ?? [];

      const activeStreams = streams
        .filter((s) => s.active)
        .map((s) => ({
          llamaContractAddress: s.contract.address,
          amountPerSec: s.amountPerSec,
          createdTimestamp: s.createdTimestamp,
          payerAddress: s.payer.id,
          payeeAddress: s.payee.id,
          streamId: s.streamId,
          token: s.token,
          tokenContract: createERC20Contract({ tokenAddress: getAddress(s.token.address), provider }),
          llamaTokenContract: createContract(getAddress(s.contract.address), provider),
        }));

      return {
        streams: activeStreams.length > 0 ? activeStreams : null,
        history: data?.user?.historicalEvents ?? null,
      };
    } else return { streams: null, history: null };
  }, [data, provider]);

  return React.useMemo(() => ({ data: formattedData, isLoading, error }), [formattedData, isLoading, error]);
};

export default useStreamsAndHistory;
