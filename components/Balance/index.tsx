import * as React from 'react';
import DepositForm from './DepositForm';
import WithdrawForm from './WithdrawForm';
import DepositField from './DepositField';
import { useBalances, useChainExplorer } from 'hooks';
import { IBalance } from 'types';
import { IFormData, TokenAction } from './types';
import { useDialogState } from 'ariakit';
import { BalanceAndSymbol } from './BalanceAndSymbol';
import { UntilDepleted } from './UntilDepleted';
import { MonthlyCost } from './MonthlyCost';
import Image from 'next/image';
import Fallback from 'components/FallbackList';
import { BalanceIcon } from 'components/Icons';
import { useAccount } from 'wagmi';
import useTokenBalances from 'queries/useTokenBalances';
import { BeatLoader } from 'react-spinners';
import { useTranslations } from 'next-intl';

const Balance = () => {
  const { balances, noBalances, isLoading, isError } = useBalances();

  // function that returns chain explorer url based on the chain user is connected to
  const { url: chainExplorer } = useChainExplorer();

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

  const t = useTranslations('Common');

  return (
    <div className="mr-auto w-full">
      <div className={showFallback ? 'w-full max-w-2xl' : 'w-full max-w-fit'}>
        <div className="section-header flex w-full flex-wrap items-center justify-between gap-[0.625rem]">
          <span className="flex items-center gap-[0.625rem]">
            <BalanceIcon />
            <h1 className="font-exo">{t1('heading')}</h1>
          </span>

          <button
            className="primary-button"
            disabled={isLoading || tokensLoading}
            onClick={() => {
              depositFieldDialog.toggle();
            }}
          >
            {isLoading || tokensLoading ? <BeatLoader size={6} color="white" /> : <>{t1('deposit')}</>}
          </button>
        </div>

        {showFallback ? (
          <Fallback isLoading={isLoading} isError={isError} noData={noBalances} type="balances" />
        ) : (
          <div className="mt-[-10px] overflow-x-auto">
            <table className="border-separate" style={{ borderSpacing: '0 10px' }}>
              <thead>
                <tr>
                  <th className="whitespace-nowrap px-4 py-[6px] text-left text-sm font-semibold text-[#3D3D3D]">
                    {t0('token')}
                  </th>
                  <th className="whitespace-nowrap px-4 py-[6px] text-left text-sm font-semibold text-[#3D3D3D]">
                    {t1('balance')}
                  </th>
                  <th className="whitespace-nowrap px-4 py-[6px] text-left text-sm font-semibold text-[#3D3D3D]">
                    {t1('toDepleted')}
                  </th>
                  <th className="whitespace-nowrap px-4 py-[6px] text-left text-sm font-semibold text-[#3D3D3D]">
                    {t1('monthlyCost')}
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {balances?.map((b) => (
                  <tr key={b.address}>
                    <th className="w-full whitespace-nowrap rounded-l border border-r-0 border-[#C0C0C0] bg-[#F9FDFB] px-4 py-[6px] text-left text-sm font-normal text-[#3D3D3D]">
                      <div className="flex items-center space-x-2">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center rounded-full">
                          <Image src={b.logoURI} alt={t('logoAlt', { name: b.name })} width="18px" height="18px" />
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
                    <td
                      className="whitespace-nowrap border border-r-0 border-[#C0C0C0] bg-[#F9FDFB] px-4 py-[6px] text-sm text-[#3D3D3D]"
                      style={{ borderLeft: '1px dashed rgb(176 175 186 / 20%)' }}
                    >
                      <BalanceAndSymbol data={b} />
                    </td>
                    <td
                      className="whitespace-nowrap border border-r-0 border-[#C0C0C0] bg-[#F9FDFB] px-4 py-[6px] text-sm text-[#3D3D3D]"
                      style={{ borderLeft: '1px dashed rgb(176 175 186 / 20%)' }}
                    >
                      <UntilDepleted data={b} />
                    </td>
                    <td
                      className="whitespace-nowrap border border-r-0 border-[#C0C0C0] bg-[#F9FDFB] px-4 py-[6px] text-sm text-[#3D3D3D]"
                      style={{ borderLeft: '1px dashed rgb(176 175 186 / 20%)' }}
                    >
                      <MonthlyCost data={b} />
                    </td>
                    <td
                      className="rounded-r border border-[#C0C0C0] bg-[#F9FDFB] px-4 py-[6px] text-sm text-[#3D3D3D]"
                      style={{ borderLeft: '1px dashed rgb(176 175 186 / 20%)' }}
                    >
                      <span className="flex gap-3">
                        <button
                          className="text-xs text-black/80 underline disabled:cursor-not-allowed"
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
      </div>
    </div>
  );
};

export default Balance;
