import * as React from 'react';
import FallbackList from 'components/FallbackList';
import { DialogHeader, DialogWrapper } from 'components/Dialog';
import DepositForm from './DepositForm';
import WithdrawForm from './WithdrawForm';
import DepositField from './DepositField';
import { useChainExplorer } from 'hooks';
import useGetAllTokens from 'queries/useGetAllTokens';
import { IBalance } from 'types';
import { IBalanceProps, IFormData, TokenAction } from './types';

const Balance = ({ isLoading, noBalances, balances, isError }: IBalanceProps) => {
  // function that returns chain explorer url based on the chain user is connected to
  const chainExplorer = useChainExplorer();
  const [openDialog, setOpenDialog] = React.useState(false);

  const formData = React.useRef<null | IFormData>(null);

  // TODO handle loading and error states
  const { data: tokens } = useGetAllTokens();

  const handleToken = (actionType: TokenAction, balance: IBalance) => {
    setOpenDialog(true);
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

  return (
    <section className="w-full max-w-lg overflow-x-auto">
      <h1 className="mb-3 text-center text-xl">Balances</h1>

      {isLoading || noBalances || isError ? (
        <FallbackList
          isLoading={isLoading}
          data={noBalances && false}
          error={isError}
          noDataText="No deposited tokens"
        />
      ) : (
        <table className="border-collapse">
          <thead>
            <tr className="border">
              <th className="border font-normal">Token</th>
              <th className="border font-normal">Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {balances?.map((b) => (
              <tr key={b.address} className="border">
                {/* TODO handle decimals and display token name and image when not on testnet */}
                <th className="w-full border p-1 text-left font-normal">
                  {chainExplorer ? (
                    <a href={`${chainExplorer}/address/${b.contractAddress}`} target="_blank" rel="noopener noreferrer">
                      {b.name || b.address}
                    </a>
                  ) : (
                    <span>{b.name || b.address}</span>
                  )}
                </th>
                <td className="whitespace-nowrap border p-1 text-right">{`${b.amount} ${b.symbol}`}</td>
                <td className="space-x-2 border p-1">
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
      {tokens && <DepositField tokens={tokens} />}
      <DialogWrapper isOpen={openDialog} setIsOpen={setOpenDialog}>
        {formData.current && (
          <>
            <DialogHeader title={formData.current.title} setIsOpen={setOpenDialog} />
            {formData.current.actionType === 'deposit' ? (
              <DepositForm data={formData.current} />
            ) : (
              <WithdrawForm data={formData.current} />
            )}
          </>
        )}
      </DialogWrapper>
    </section>
  );
};

export default Balance;
