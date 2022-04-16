import * as React from 'react';
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
import Image from 'next/image';
import Fallback from 'components/FallbackList';

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
      title: balance.name || balance.address,
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
        <div className="section-header flex flex-wrap items-center justify-between gap-2">
          <h1>Balances</h1>
          <button
            className="whitespace-nowrap rounded-[10px] border border-[#1BDBAD] bg-[#23BD8F] py-2 px-12 text-sm font-bold text-white shadow-[0px_3px_7px_rgba(0,0,0,0.12)]"
            onClick={() => {
              depositFieldDialog.toggle();
            }}
          >
            Deposit
          </button>
        </div>

        {showFallback ? (
          <Fallback isLoading={isLoading} isError={isError} noData={noBalances} type="balances" />
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
