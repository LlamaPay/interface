import * as React from 'react';
import DepositForm from './DepositForm';
import WithdrawForm from './WithdrawForm';
import DepositField from './DepositField';
import { useBalances, useChainExplorer } from '~/hooks';
import type { IBalance } from '~/types';
import type { IFormData, TokenAction } from './types';
import { useDialogState } from 'ariakit';
import { BalanceAndSymbol } from './BalanceAndSymbol';
import { UntilDepleted } from './UntilDepleted';
import { MonthlyCost } from './MonthlyCost';
import Image from 'next/image';
import Fallback from '~/components/Fallback';
import { BalanceIcon } from '~/components/Icons';
import { useAccount } from 'wagmi';
import useTokenBalances from '~/queries/useTokenBalances';
import { BeatLoader } from 'react-spinners';
import { useTranslations } from 'next-intl';
import classNames from 'classnames';

const Balance = (props: { address?: string }) => {
  const { balances, noBalances, isLoading, isError } = useBalances(props.address);

  // function that returns chain explorer url based on the chain user is connected to
  const { url: chainExplorer, id } = useChainExplorer();

  const depositFormDialog = useDialogState();
  const depositFieldDialog = useDialogState();
  const withdrawFormDialog = useDialogState();

  const formData = React.useRef<null | IFormData>(null);

  const { data: tokens, isLoading: tokensLoading } = useTokenBalances();

  const [{ data: accountData }] = useAccount();

  const t0 = useTranslations('Common');
  const t1 = useTranslations('Balances');

  const handleToken = (actionType: TokenAction, balance: IBalance) => {
    if (actionType === 'deposit') {
      depositFormDialog.toggle();
    } else {
      withdrawFormDialog.toggle();
    }

    const token = tokens?.find((t) => t.tokenAddress.toLowerCase() === balance.address.toLowerCase()) ?? null;

    formData.current = {
      actionType,
      title: balance.name || balance.address,
      symbol: balance.symbol,
      selectedToken: token,
      userBalance: balance.amount,
      tokenDecimals: balance.tokenDecimals,
      tokenAddress: balance.address,
      tokenContract: balance.tokenContract,
      llamaContractAddress: balance.contractAddress,
      logoURI: balance.logoURI,
      submit: actionType === 'deposit' ? 'Deposit' : 'Withdraw',
    };
  };

  const showFallback = isLoading || noBalances || isError;
  const showActions = props.address === undefined;

  const t = useTranslations('Common');

  return (
    <section className={classNames('-mt-2', showFallback ? 'w-full' : 'w-fit')}>
      <div className="section-header flex w-full flex-wrap items-center justify-between gap-[0.625rem]">
        <span className="flex items-center gap-[0.625rem]">
          <BalanceIcon />
          <h1 className="font-exo">{t1('heading')}</h1>
        </span>

        {showActions && (
          <button
            className="primary-button"
            disabled={isLoading || tokensLoading || !accountData || !tokens}
            onClick={() => {
              depositFieldDialog.toggle();
            }}
          >
            {isLoading || tokensLoading ? <BeatLoader size={6} color="white" /> : <>{t1('deposit')}</>}
          </button>
        )}
      </div>

      {showFallback ? (
        <Fallback
          isLoading={isLoading}
          isError={isError}
          noData={noBalances}
          supressWalletConnection={!showActions}
          type="balances"
        />
      ) : (
        <div className="mt-[-10px] max-w-[calc(100vw-16px)] overflow-x-auto">
          <table className="border-separate" style={{ borderSpacing: '0 10px' }}>
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-[6px] text-left text-sm font-semibold text-lp-gray-4 dark:text-white">
                  {t0('token')}
                </th>
                <th className="whitespace-nowrap px-4 py-[6px] text-left text-sm font-semibold text-lp-gray-4 dark:text-white">
                  {t1('balance')}
                </th>
                <th className="whitespace-nowrap px-4 py-[6px] text-left text-sm font-semibold text-lp-gray-4 dark:text-white">
                  {t1('toDepleted')}
                </th>
                <th className="whitespace-nowrap px-4 py-[6px] text-left text-sm font-semibold text-lp-gray-4 dark:text-white">
                  {t1('monthlyCost')}
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {balances?.map((b) => (
                <tr key={b.address}>
                  <th className="whitespace-nowrap rounded-l border border-r-0 border-[#C0C0C0] bg-[#F9FDFB] px-4 py-[6px] text-left text-sm font-normal text-lp-gray-4 dark:border-[#3e3e42] dark:bg-neutral-800 dark:text-white">
                    <div className="flex items-center space-x-2">
                      <span className="h-[18px] w-[18px] rounded-full">
                        <Image src={b.logoURI} alt={t('logoAlt', { name: b.name })} width="18px" height="18px" />
                      </span>
                      {chainExplorer ? (
                        <a
                          href={
                            id === 82 || id === 1088
                              ? `${chainExplorer}address/${b.contractAddress}`
                              : `${chainExplorer}/address/${b.contractAddress}`
                          }
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
                  <td className={classNames(tableCellClassnames, 'border-r-0')} style={tableCellInlineStyles}>
                    <BalanceAndSymbol data={b} />
                  </td>
                  <td className={classNames(tableCellClassnames, 'border-r-0')} style={tableCellInlineStyles}>
                    <UntilDepleted data={b} />
                  </td>
                  <td
                    className={classNames(tableCellClassnames, showActions ? 'border-r-0' : 'rounded-r')}
                    style={tableCellInlineStyles}
                  >
                    <MonthlyCost data={b} />
                  </td>
                  {showActions && (
                    <td className={classNames(tableCellClassnames, 'rounded-r')} style={tableCellInlineStyles}>
                      <span className="flex gap-3">
                        <button
                          className="whitespace-nowrap text-xs text-black/80 underline disabled:cursor-not-allowed dark:text-white"
                          onClick={() => handleToken('withdraw', b)}
                          disabled={Number.isNaN(b.amount) || Number(b.amount) <= 0}
                        >
                          {t0('withdraw')}
                        </button>
                        <button
                          className="primary-button py-1 px-[6px] text-xs font-medium"
                          onClick={() => handleToken('deposit', b)}
                        >
                          {t1('topup')}
                        </button>
                      </span>
                    </td>
                  )}
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

      {tokens && accountData && (
        <DepositField tokens={tokens} userAddress={accountData.address} dialog={depositFieldDialog} />
      )}
    </section>
  );
};

const tableCellClassnames =
  'whitespace-nowrap border border-[#C0C0C0] bg-[#F9FDFB] px-4 py-[6px] text-sm text-lp-gray-4 dark:border-[#3e3e42] dark:bg-neutral-800 dark:text-white';
const tableCellInlineStyles = {
  borderLeft: '1px dashed rgb(176 175 186 / 20%)',
};

export default Balance;
