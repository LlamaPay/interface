import * as React from 'react';
import { useGetContracts } from 'queries/useGetContracts';
import { useGetPayerBalance } from 'queries/useGetPayerBalance';
import { formatAddress } from 'utils/address';
import FallbackList from 'components/FallbackList';

const Balance = () => {
  //TODO handle error and loading states
  const { data: contracts = [], isLoading: contractsLoading, error: contractsError } = useGetContracts();
  const { data: balances, isLoading: balancesLoading, error: balancesError } = useGetPayerBalance(contracts);

  const error = balancesError || contractsError;
  const isLoading = balancesLoading || contractsLoading;
  const noBalances = !balances || balances.length === 0;

  return (
    <section className="w-full max-w-lg">
      <h1 className="mb-3 text-center text-xl">Balances</h1>
      {isLoading || noBalances || error ? (
        <FallbackList isLoading={isLoading} data={noBalances && false} error={error} noDataText="No deposited tokens" />
      ) : (
        <ul className="mx-auto min-h-[44px] max-w-2xl space-y-3 border p-2">
          {balances?.map((b) => (
            <li key={b.token} className="flex justify-between space-x-2">
              {/* TODO handle decimals and display token name and image when not on testnet */}
              <p className="truncate">{formatAddress(b.token)}</p>
              <p>{b.amount}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Balance;
