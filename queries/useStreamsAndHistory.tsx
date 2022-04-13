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
      const history = data?.user?.historicalEvents ?? [];

      const formattedStreams = streams.map((s) => ({
        llamaContractAddress: s.contract.address,
        amountPerSec: s.amountPerSec,
        createdTimestamp: s.createdTimestamp,
        payerAddress: s.payer.id,
        payeeAddress: s.payee.id,
        streamId: s.streamId,
        token: s.token,
        tokenName: s.token.name,
        tokenSymbol: s.token.symbol,
        tokenContract: createERC20Contract({ tokenAddress: getAddress(s.token.address), provider }),
        llamaTokenContract: createContract(getAddress(s.contract.address), provider),
      }));

      const formattedHistory = history.map((h) => ({
        ...h,
        amountPerSec: h.stream?.amountPerSec ?? null,
        addressRelated: h.stream?.payee?.id ?? null,
      }));

      return {
        streams: formattedStreams.length > 0 ? formattedStreams : null,
        history: formattedHistory.length > 0 ? formattedHistory : null,
      };
    } else return { streams: null, history: null };
  }, [data, provider]);

  return React.useMemo(() => ({ data: formattedData, isLoading, error }), [formattedData, isLoading, error]);
};

export default useStreamsAndHistory;
