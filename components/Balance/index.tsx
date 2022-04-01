import * as React from 'react';
import FallbackList from 'components/FallbackList';
import { IBalance } from 'types';
import useChainExplorer from 'hooks/useChainExplorer';
import { DialogHeader, DialogWrapper } from 'components/Dialog';

interface IBalanceProps {
  balances: IBalance[] | null;
  noBalances: boolean;
  isLoading: boolean;
  isError: boolean;
}

type TokenAction = 'deposit' | 'withdraw';

const Balance = ({ isLoading, noBalances, balances, isError }: IBalanceProps) => {
  // function that returns chain explorer url based on the chain user is connected to
  const chainExplorer = useChainExplorer();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [actionType, setActionType] = React.useState({
    type: null as string | null,
    llamaContractAddress: null as string | null,
    title: null as 'Deposit' | 'Withdraw' | null,
  });

  const handleToken = (type: TokenAction, llamaContractAddress: string) => {
    setOpenDialog(true);
    setActionType({ type, llamaContractAddress, title: type === 'deposit' ? 'Deposit' : 'Withdraw' });
  };

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
                      className="rounded bg-gray-100 py-1 px-2"
                      onClick={() => handleToken('deposit', b.contractAddress)}
                    >
                      Deposit
                    </button>
                    <button
                      className="rounded bg-gray-100 py-1 px-2"
                      onClick={() => handleToken('withdraw', b.contractAddress)}
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
      <DialogWrapper isOpen={openDialog} setIsOpen={setOpenDialog}>
        <DialogHeader title={actionType.title} setIsOpen={setOpenDialog} />
      </DialogWrapper>
    </section>
  );
};

export default Balance;
