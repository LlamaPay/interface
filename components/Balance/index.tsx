import * as React from 'react';
import FallbackList from 'components/FallbackList';
import { IBalance } from 'types';
import useChainExplorer from 'hooks/useChainExplorer';

interface IBalanceProps {
  balances: IBalance[] | null;
  noBalances: boolean;
  isLoading: boolean;
  isError: boolean;
}

const Balance = ({ isLoading, noBalances, balances, isError }: IBalanceProps) => {
  const chainExplorer = useChainExplorer();

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
            <li key={b.address} className="flex justify-between space-x-2">
              {/* TODO handle decimals and display token name and image when not on testnet */}
              <p className="flex items-center space-x-2">
                {chainExplorer ? (
                  <a href={`${chainExplorer}/address/${b.contractAddress}`} target="_blank" rel="noopener noreferrer">
                    {b.name || b.address}
                  </a>
                ) : (
                  <span>{b.name || b.address}</span>
                )}
              </p>
              <p>{`${b.amount} ${b.symbol}`}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Balance;
