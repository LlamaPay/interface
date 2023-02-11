import * as React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Fallback, { FallbackContainer } from '~/components/Fallback';
import { StreamIcon } from '~/components/Icons';
import { StreamTable, DefaultStreamTable } from './Table';
import type { IStreamAndHistory } from '~/types';
import StreamMenu from './Menu';
import useStreamsAndHistory from '~/queries/useStreamsAndHistory';

export function StreamSection() {
  const { data, isLoading, error } = useStreamsAndHistory();

  const t = useTranslations('Streams');

  return (
    <>
      <section className="w-full">
        <div className="section-header flex w-full flex-wrap items-center justify-between gap-[0.625rem]">
          <span className="flex items-center gap-[0.625rem]">
            <StreamIcon />
            <h1 className="font-exo">{t('heading')}</h1>
          </span>

          <div className="flex flex-wrap gap-[0.625rem]">
            <Link href="/create" className="primary-button py-2 px-4 text-sm font-bold">
              {t('create')}
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
          <h1 className="font-exo">{t('heading')}</h1>
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
