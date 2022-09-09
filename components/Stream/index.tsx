import * as React from 'react';
import Link from 'next/link';
import Fallback, { FallbackContainer } from 'components/Fallback';
import { StreamIcon } from 'components/Icons';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import { StreamTable, DefaultStreamTable } from './Table';
import { IStreamAndHistory } from 'types';
import StreamMenu from './Menu';
import { useTranslations } from 'next-intl';
import { useDialogState } from 'ariakit';
import { botDeployedOn } from 'utils/constants';
import BotFunds from 'components/Schedule/BotManage';
import { useAccount } from 'wagmi';
import { useNetworkProvider } from 'hooks';
import ScheduleTransfer from 'components/Schedule/ScheduleTransfer';

export function StreamSection() {
  const { data, isLoading, error } = useStreamsAndHistory();

  const t = useTranslations('Streams');

  const botDialog = useDialogState();
  const scheduleTransferDialog = useDialogState();
  const [{ data: accountData }] = useAccount();
  const { nativeCurrency, chainId } = useNetworkProvider();

  return (
    <>
      <section className="w-full">
        <div className="section-header flex w-full flex-wrap items-center justify-between gap-[0.625rem]">
          <span className="flex items-center gap-[0.625rem]">
            <StreamIcon />
            <h1 className="font-exo dark:text-white">{t('heading')}</h1>
          </span>

          <div className="flex flex-wrap gap-[0.625rem]">
            <Link href="/create">
              <a className="primary-button py-2 px-4 text-sm font-bold">{t('create')}</a>
            </Link>

            {accountData && (
              <button onClick={scheduleTransferDialog.toggle} className="primary-button py-2 px-4 text-sm font-bold">
                {'Scheduled Transfers'}
              </button>
            )}

            {chainId && botDeployedOn.includes(chainId) && (
              <button onClick={botDialog.toggle} className="primary-button py-2 px-4 text-sm font-bold">
                {'Manage Bot'}
              </button>
            )}
            <StreamMenu />
          </div>
        </div>
        {isLoading || error || !data?.streams || data.streams?.length < 1 ? (
          <Fallback isLoading={isLoading} isError={error ? true : false} noData={true} type="streams" />
        ) : (
          <StreamTable data={data.streams} />
        )}
      </section>
      {chainId && accountData && botDeployedOn.includes(chainId) && (
        <BotFunds
          dialog={botDialog}
          chainId={chainId}
          accountAddress={accountData?.address}
          nativeCurrency={nativeCurrency?.symbol}
        />
      )}
      {chainId && accountData && <ScheduleTransfer dialog={scheduleTransferDialog} userAddress={accountData.address} />}
    </>
  );
}

export function AltStreamSection({
  isLoading,
  isError,
  data,
}: {
  isLoading: boolean;
  isError: boolean;
  data?: IStreamAndHistory;
}) {
  const t = useTranslations('Streams');
  return (
    <section className="w-full">
      <div className="section-header">
        <span className="flex items-center gap-[0.625rem]">
          <StreamIcon />
          <h1 className="font-exo dark:text-white">{t('heading')}</h1>
        </span>
      </div>
      {isLoading || isError || !data?.streams || data.streams?.length < 1 ? (
        <FallbackContainer>
          {isLoading ? null : isError ? <p>{t('error')}</p> : !data?.streams ? <p>{t('noActiveStreams')}</p> : null}
        </FallbackContainer>
      ) : (
        <DefaultStreamTable data={data.streams} />
      )}
    </section>
  );
}

export { CreateStream } from './CreateStream';
export { StreamTable } from './Table';
