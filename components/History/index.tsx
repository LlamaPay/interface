import * as React from 'react';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import Fallback from 'components/FallbackList';
import { HistoryIcon } from 'components/Icons';
import { HistoryTable } from './Table';
import { StreamAndHistoryQuery } from 'services/generated/graphql';

export function HistorySection() {
  const { data, isLoading, error } = useStreamsAndHistory();

  const history = React.useMemo(() => {
    if (!data?.history || data.history?.length < 1) return false;

    return data.history;
  }, [data]);

  return (
    <section className="w-full">
      <span className="section-header flex items-center gap-[0.625rem]">
        <HistoryIcon />
        <h1 className="font-exo">History</h1>
      </span>

      {isLoading || error || !history ? (
        <Fallback isLoading={isLoading} isError={error ? true : false} noData={true} type="history" />
      ) : (
        <HistoryTable data={data.history || []} />
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
  data?: StreamAndHistoryQuery;
}) {
  return (
    <section className="w-full">
      <div className="section-header">
        <span className="flex items-center gap-[0.625rem]">
          <HistoryIcon />
          <h1 className="font-exo">History</h1>
        </span>
      </div>
      {isLoading || isError || !data ? (
        <div className="flex h-14 w-full items-center justify-center rounded border border-dashed border-[#626262] text-xs font-semibold">
          {isLoading ? null : isError ? <p>Couldn't load history</p> : !data ? <p>No historical data</p> : null}
        </div>
      ) : (
        <></>
      )}
    </section>
  );
}

export { HistoryTable } from './Table';
