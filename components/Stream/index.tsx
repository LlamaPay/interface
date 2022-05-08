import * as React from 'react';
import Link from 'next/link';
import Fallback from 'components/FallbackList';
import { StreamIcon } from 'components/Icons';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import { StreamTable, DefaultStreamTable } from './Table';
import { IStreamAndHistory } from 'types';
import StreamMenu from './Menu';
import { useTranslations } from 'next-intl';

export function StreamSection() {
  const { data, isLoading, error } = useStreamsAndHistory();

  const t = useTranslations('Streams');

  return (
    <section className="w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between gap-[0.625rem]">
        <span className="flex items-center gap-[0.625rem]">
          <StreamIcon />
          <h1 className="font-exo">{t('heading')}</h1>
        </span>

        <div className="flex flex-wrap gap-[0.625rem]">
          <Link href="/create">
            <a className="primary-button py-2 px-8 text-sm font-bold">{t('create')}</a>
          </Link>

          <StreamMenu />
        </div>
      </div>
      {isLoading || error || !data?.streams || data.streams?.length < 1 ? (
        <Fallback isLoading={isLoading} isError={error ? true : false} noData={true} type="streams" />
      ) : (
        <StreamTable data={data.streams} />
      )}
    </section>
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
          <h1 className="font-exo">{t('heading')}</h1>
        </span>
      </div>
      {isLoading || isError || !data?.streams || data.streams?.length < 1 ? (
        <div className="flex h-14 w-full items-center justify-center rounded border border-dashed border-[#626262] text-xs font-semibold">
          {isLoading ? null : isError ? <p>{t('error')}</p> : !data?.streams ? <p>{t('noActiveStreams')}</p> : null}
        </div>
      ) : (
        <DefaultStreamTable data={data.streams} />
      )}
    </section>
  );
}

export { CreateStream } from './CreateStream';
export { StreamTable } from './Table';
