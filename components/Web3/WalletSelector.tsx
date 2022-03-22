import * as React from 'react';
import { Connector, ConnectorData, useConnect } from 'wagmi';
import { useIsMounted } from '../../hooks';

type Props = {
  onError?(error: Error): void;
  onSuccess?(data: ConnectorData): void;
};

export const WalletSelector = ({ onError, onSuccess }: Props) => {
  const isMounted = useIsMounted();
  const [
    {
      data: { connector, connectors },
      error,
      loading,
    },
    connect,
  ] = useConnect();

  const handleConnect = React.useCallback(
    async (connector: Connector) => {
      const { data, error } = await connect(connector);
      if (error) onError?.(error);
      if (data) onSuccess?.(data);
    },
    [connect, onError, onSuccess]
  );

  return (
    <>
      <div className="flex space-x-4">
        {connectors.map((x) => (
          <button key={x.id} onClick={() => handleConnect(x)}>
            {isMounted ? x.name : x.id === 'injected' ? x.id : x.name}
          </button>
        ))}
      </div>
      {error && <p className="mt-4 text-red-500">{error?.message ?? 'Failed to connect'}</p>}
    </>
  );
};
