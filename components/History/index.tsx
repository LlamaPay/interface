import * as React from 'react';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import Fallback from 'components/FallbackList';
import { HistoryIcon } from 'components/Icons';
import { HistoryTable } from './Table';
import { IStreamAndHistory } from 'types';

export function HistorySection() {
  const { data, isLoading, error } = useStreamsAndHistory();

  return (
    <section className="w-full">
      <div className="section-header">
        <span className="flex items-center gap-[0.625rem]">
          <HistoryIcon />
          <h1 className="font-exo">History</h1>
        </span>
      </div>

      {isLoading || error || !data?.history || data.history?.length < 1 ? (
        <Fallback isLoading={isLoading} isError={error ? true : false} noData={true} type="history" />
      ) : (
        <HistoryTable data={data.history} />
      )}
    </section>
  );
}

export function AltHistorySection({
  isLoading,
  isError,
  data,
}: {
  isLoading: boolean;
  isError: boolean;
  data?: IStreamAndHistory;
}) {
  return (
    <section className="w-full">
      <div className="section-header">
        <span className="flex items-center gap-[0.625rem]">
          <HistoryIcon />
          <h1 className="font-exo">History</h1>
        </span>
      </div>
      {isLoading || isError || !data?.history || data.history?.length < 1 ? (
        <div className="flex h-14 w-full items-center justify-center rounded border border-dashed border-[#626262] text-xs font-semibold">
          {isLoading ? null : isError ? (
            <p>Couldn't load history</p>
          ) : !data?.history || data.history?.length < 1 ? (
            <p>No historical data</p>
          ) : null}
        </div>
      ) : (
        <HistoryTable data={data.history} />
      )}
    </section>
  );
}

export { HistoryTable } from './Table';
