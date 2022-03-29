import * as React from 'react';
import { formatAddress } from 'utils/address';
import FallbackList from 'components/FallbackList';
import { IBalance } from 'types';

interface IBalanceProps {
  balances: IBalance[] | null;
  noBalances: boolean;
  isLoading: boolean;
  isError: boolean;
}

const Balance = ({ isLoading, noBalances, balances, isError }: IBalanceProps) => {
  return (
    <section className="w-full max-w-lg">
      <h1 className="mb-3 text-center text-xl">Balances</h1>
      {isLoading || noBalances || isError ? (
        <FallbackList
          isLoading={isLoading}
          data={noBalances && false}
          error={isError}
          noDataText="No deposited tokens"
        />
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
