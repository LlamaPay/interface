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
import { BalanceIcon } from 'components/Icons';

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
      <section className={showFallback ? 'w-full max-w-2xl' : 'w-full max-w-fit'}>
        <div className="section-header flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center space-x-2">
            <BalanceIcon />
            <h1>Balances</h1>
          </span>

          <button
            className="primary-button py-2 px-8 text-sm font-bold"
            onClick={() => {
              depositFieldDialog.toggle();
            }}
          >
            Deposit new token
          </button>
        </div>

        {showFallback ? (
          <Fallback isLoading={isLoading} isError={isError} noData={noBalances} type="balances" />
        ) : (
          <div className="overflow-x-auto">
            <table className="dark:border-stone-700-collapse border">
              <thead>
                <tr className="border dark:border-stone-700">
                  <th className="font-inter whitespace-nowrap border px-4 pt-[6px] pb-[5px] text-left text-sm font-[500] dark:border-stone-700">
                    Token
                  </th>
                  <th className="font-inter whitespace-nowrap border px-4 pt-[6px] pb-[5px] text-left text-sm font-[500] dark:border-stone-700">
                    Amount
                  </th>
                  <th className="font-inter whitespace-nowrap border px-4 pt-[6px] pb-[5px] text-left text-sm font-[500] dark:border-stone-700">
                    To Depleted
                  </th>
                  <th className="font-inter whitespace-nowrap border px-4 pt-[6px] pb-[5px] text-left text-sm font-[500] dark:border-stone-700">
                    Monthly Cost
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {balances?.map((b) => (
                  <tr key={b.address} className="border dark:border-stone-700">
                    <th className="font-inter w-full whitespace-nowrap border px-4 py-[6px] text-left text-sm font-normal dark:border-stone-700">
                      <div className="flex items-center space-x-2">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center rounded-full">
                          <Image src={b.logoURI} alt={'Logo of token' + b.name} width="18px" height="18px" />
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
                    <td className="font-inter space-x-2 border px-4 py-[6px] text-sm opacity-80 dark:border-stone-700">
                      <span className="flex gap-4">
                        <button
                          className="text-xs underline disabled:cursor-not-allowed"
                          onClick={() => handleToken('withdraw', b)}
                          disabled={Number.isNaN(b.amount) || Number(b.amount) <= 0}
                        >
                          Withdraw
                        </button>
                        <button className="primary-button py-1 px-[6px]" onClick={() => handleToken('deposit', b)}>
                          Topup
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
