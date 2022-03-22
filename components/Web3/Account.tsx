import * as React from 'react';
import { useAccount } from 'wagmi';

import { formatAddress } from '../../lib/address';

export const Account = () => {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  });

  if (!accountData) return null;

  const formattedAddress = formatAddress(accountData.address);
  return (
    <div className="flex flex-col space-y-4 border text-center">
      <div>{accountData.ens?.name ? `${accountData.ens?.name} (${formattedAddress})` : formattedAddress}</div>
      {accountData.connector?.name && <div>Connected to {accountData.connector.name}</div>}
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
};
