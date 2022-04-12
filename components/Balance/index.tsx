import * as React from 'react';
import { PlusIcon } from '@heroicons/react/solid';
import FallbackList from 'components/FallbackList';
import DepositForm from './DepositForm';
import WithdrawForm from './WithdrawForm';
import DepositField from './DepositField';
import { useBalances, useChainExplorer } from 'hooks';
import useGetAllTokens from 'queries/useGetAllTokens';
import { IBalance } from 'types';
import { IFormData, TokenAction } from './types';
import { useDialogState } from 'ariakit';
import { BalanceAndSymbol } from './BalanceAndSymbol';
import { UntilDepleted } from './UntilDepleted';
import classNames from 'classnames';

const Balance = () => {
  const { balances, noBalances, isLoading, isError } = useBalances();

  // function that returns chain explorer url based on the chain user is connected to
  const { url: chainExplorer } = useChainExplorer();

  const depositFormDialog = useDialogState();
  const depositFieldDialog = useDialogState();
  const withdrawFormDialog = useDialogState();

  const formData = React.useRef<null | IFormData>(null);

  // TODO handle loading and error states
  const { data: tokens } = useGetAllTokens();

  const handleToken = (actionType: TokenAction, balance: IBalance) => {
    // dialog.toggle();
    if (actionType === 'deposit') {
      depositFormDialog.toggle();
    } else {
      withdrawFormDialog.toggle();
    }

    formData.current = {
      actionType,
      title: balance.name || balance.address, // TODO only show name of verified tokens, else show address
      symbol: balance.symbol,
      tokenDecimals: balance.tokenDecimals,
      tokenAddress: balance.address,
      tokenContract: balance.tokenContract,
      llamaContractAddress: balance.contractAddress,
      submit: actionType === 'deposit' ? 'Deposit' : 'Withdraw',
    };
  };

  const showFallback = isLoading || noBalances || isError;

  return (
    <section className={classNames('overflow-x-auto', showFallback ? 'w-full max-w-xl' : 'w-fit')}>
      <span className="mb-1 flex items-center justify-between">
        <h1 className="text-xl">Balances</h1>
        <button
          className="flex items-center space-x-2 whitespace-nowrap rounded bg-zinc-100 py-1 px-2 dark:bg-zinc-800"
          onClick={() => {
            depositFieldDialog.toggle();
          }}
        >
          <PlusIcon className="h-4 w-4" />
          <span>Deposit</span>
        </button>
      </span>

      {showFallback ? (
        <FallbackList
          isLoading={isLoading}
          data={noBalances && false}
          error={isError}
          noDataText="No deposited tokens"
        />
      ) : (
        <table className="dark:border-stone-700-collapse border">
          <thead>
            <tr className="border dark:border-stone-700">
              <th className="whitespace-nowrap border px-1 font-normal dark:border-stone-700">Token</th>
              <th className="whitespace-nowrap border px-1 font-normal dark:border-stone-700">Amount</th>
              <th className="whitespace-nowrap border px-1 font-normal dark:border-stone-700">To Depleted</th>
              <th className="whitespace-nowrap border px-1 font-normal dark:border-stone-700">Monthly Cost</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {balances?.map((b) => (
              <tr key={b.address} className="border dark:border-stone-700">
                {/* TODO handle decimals and display token name and image when not on testnet */}
                <th className="w-full border p-1 text-left font-normal dark:border-stone-700">
                  {chainExplorer ? (
                    <a href={`${chainExplorer}/address/${b.contractAddress}`} target="_blank" rel="noopener noreferrer">
                      {b.name || b.address}
                    </a>
                  ) : (
                    <span>{b.name || b.address}</span>
                  )}
                </th>
                <BalanceAndSymbol data={b} />
                <UntilDepleted data={b} />
                <td className="whitespace-nowrap border p-1 text-right slashed-zero tabular-nums dark:border-stone-700">
                  {((Number(b.totalPaidPerSec) * 2592000) / 1e20).toLocaleString('en-US', {
                    maximumFractionDigits: 5,
                  })}{' '}
                  {b.symbol}
                </td>
                <td className="space-x-2 border p-1 dark:border-stone-700">
                  <span className="flex space-x-2">
                    <button
                      className="rounded bg-zinc-100 py-1 px-2 dark:bg-zinc-800"
                      onClick={() => handleToken('deposit', b)}
                    >
                      Deposit
                    </button>
                    <button
                      className="rounded bg-zinc-100 py-1 px-2 disabled:cursor-not-allowed dark:bg-zinc-800"
                      onClick={() => handleToken('withdraw', b)}
                      disabled={Number.isNaN(b.amount) || Number(b.amount) <= 0}
                    >
                      Withdraw
                    </button>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {formData.current && (
        <>
          {formData?.current?.actionType === 'deposit' ? (
            <DepositForm data={formData.current} formDialog={depositFormDialog} />
          ) : (
            <WithdrawForm data={formData.current} formDialog={withdrawFormDialog} />
          )}
        </>
      )}

      {tokens && <DepositField tokens={tokens} dialog={depositFieldDialog} />}
    </section>
  );
};

export default Balance;
