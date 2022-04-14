import * as React from 'react';
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
import { MonthlyCost } from './MonthlyCost';
import { PlusIcon } from '@heroicons/react/solid';
import Image from 'next/image';

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
    <span className="mr-auto w-full">
      <section className={showFallback ? 'w-full max-w-2xl' : 'w-fit'}>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl">Balances</h1>
          <button
            className="flex items-center space-x-2 whitespace-nowrap rounded bg-green-100 py-1 px-2 text-sm shadow dark:bg-[#153723]"
            onClick={() => {
              depositFieldDialog.toggle();
            }}
          >
            <PlusIcon className="h-[14px] w-[14px]" />
            <span>Deposit</span>
          </button>
        </div>

        {showFallback ? (
          <FallbackList
            isLoading={isLoading}
            data={noBalances && false}
            error={isError}
            noDataText="No deposited tokens"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="dark:border-stone-700-collapse border">
              <thead>
                <tr className="border dark:border-stone-700">
                  <th className="whitespace-nowrap border px-4 pt-[6px] pb-[5px] text-left text-sm font-[500] dark:border-stone-700">
                    Token
                  </th>
                  <th className="whitespace-nowrap border px-4 pt-[6px] pb-[5px] text-left text-sm font-[500] dark:border-stone-700">
                    Amount
                  </th>
                  <th className="whitespace-nowrap border px-4 pt-[6px] pb-[5px] text-left text-sm font-[500] dark:border-stone-700">
                    To Depleted
                  </th>
                  <th className="whitespace-nowrap border px-4 pt-[6px] pb-[5px] text-left text-sm font-[500] dark:border-stone-700">
                    Monthly Cost
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {balances?.map((b) => (
                  <tr key={b.address} className="border dark:border-stone-700">
                    <th className="w-full border px-4 py-[6px] text-left text-sm font-normal dark:border-stone-700">
                      <div className="flex items-center space-x-2">
                        <div className="flex flex-shrink-0 items-center rounded-full">
                          <Image src={b.logoURI} alt={'Logo of token' + b.name} width="24px" height="24px" />
                        </div>
                        {chainExplorer ? (
                          <a
                            href={`${chainExplorer}/address/${b.contractAddress}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {b.name || b.address}
                          </a>
                        ) : (
                          <span>{b.name || b.address}</span>
                        )}
                      </div>
                    </th>
                    <BalanceAndSymbol data={b} />
                    <UntilDepleted data={b} />
                    <MonthlyCost data={b} />
                    <td className="space-x-2 border px-4 py-[6px] text-sm dark:border-stone-700">
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
          </div>
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
    </span>
  );
};

export default Balance;
