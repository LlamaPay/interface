import * as React from 'react';
import Link from 'next/link';
import Fallback from 'components/FallbackList';
import { StreamIcon } from 'components/Icons';
import DisperseGasMoney from 'components/DisperseGas';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import { StreamTable } from './Table';

export function StreamSection() {
  const { data, isLoading, error } = useStreamsAndHistory();

  const streams = React.useMemo(() => {
    if (!data?.streams || data.streams?.length < 1) return false;

    return data.streams;
  }, [data]);

  return (
    <section className="w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between gap-[0.625rem]">
        <span className="flex items-center gap-[0.625rem]">
          <StreamIcon />
          <h1 className="font-exo">Streams</h1>
        </span>

        <div className="flex flex-wrap gap-[0.625rem]">
          <Link href="/create">
            <a className="primary-button py-2 px-8 text-sm font-bold">Create Stream</a>
          </Link>
          <DisperseGasMoney />
        </div>
      </div>
      {isLoading || error || !streams ? (
        <Fallback isLoading={isLoading} isError={error ? true : false} noData={true} type="streams" />
      ) : (
        <StreamTable data={streams} />
      )}
    </section>
  );
}

export { CreateStream } from './CreateStream';
export { StreamTable } from './Table';
