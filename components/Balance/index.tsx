import * as React from 'react';
import { PlusIcon } from '@heroicons/react/solid';
import FallbackList from 'components/FallbackList';
import { FormDialog } from 'components/Dialog';
import DepositForm from './DepositForm';
import WithdrawForm from './WithdrawForm';
import DepositField from './DepositField';
import { useChainExplorer } from 'hooks';
import useGetAllTokens from 'queries/useGetAllTokens';
import { IBalance } from 'types';
import { IBalanceProps, IFormData, TokenAction } from './types';
import { useDialogState } from 'ariakit';
import { BalanceAndSymbol } from './BalanceAndSymbol';
import { UntilDepleted } from './UntilDepleted';

const Balance = ({ isLoading, noBalances, balances, isError }: IBalanceProps) => {
  // function that returns chain explorer url based on the chain user is connected to
  const chainExplorer = useChainExplorer();
  const dialog = useDialogState();
  const [dialogType, setDialogType] = React.useState<'token' | 'deposit' | null>(null);

  const formData = React.useRef<null | IFormData>(null);

  // TODO handle loading and error states
  const { data: tokens } = useGetAllTokens();

  const handleToken = (actionType: TokenAction, balance: IBalance) => {
    dialog.toggle();
    setDialogType('token');
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

  const dialogTitle = dialogType === 'token' ? formData.current?.title ?? null : 'Deposit';

  return (
    <section className="w-full max-w-lg overflow-x-auto">
      <span className="mb-1 flex justify-between">
        <h1 className="text-xl">Balances</h1>
        <button
          className="flex items-center space-x-2 whitespace-nowrap rounded bg-zinc-100 py-1 px-2 dark:bg-zinc-800"
          onClick={() => {
            dialog.toggle();
            setDialogType('deposit');
          }}
        >
          <PlusIcon className="h-4 w-4" />
          <span>Deposit</span>
        </button>
      </span>

      {isLoading || noBalances || isError ? (
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
              <th className="border font-normal dark:border-stone-700">Token</th>
              <th className="border font-normal dark:border-stone-700">Amount</th>
              <th className="border font-normal dark:border-stone-700">Til depleted</th>
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

      <FormDialog title={dialogTitle} dialog={dialog} className="h-fit">
        {dialogType === 'token' ? (
          <>
            {formData.current && (
              <>
                {formData.current.actionType === 'deposit' ? (
                  <DepositForm data={formData.current} />
                ) : (
                  <WithdrawForm data={formData.current} />
                )}
              </>
            )}
          </>
        ) : (
          <>{tokens && <DepositField tokens={tokens} />}</>
        )}
      </FormDialog>
    </section>
  );
};

export default Balance;
