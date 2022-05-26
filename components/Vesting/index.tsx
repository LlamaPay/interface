import Fallback from 'components/FallbackList';
import Link from 'next/link';
import useGetVestingInfo from 'queries/useGetVestingInfo';
import { VestingTable } from './Table';

export default function VestingPage() {
  const { data, isLoading, error } = useGetVestingInfo();

  return (
    <section className="w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between">
        <h1 className="font-exo dark:text-white">{'Vesting'}</h1>
        <Link href="/vesting-create">
          <a className="primary-button text-md py-2 px-5 text-center font-bold">{'Create Contract'}</a>
        </Link>
      </div>
      {isLoading || error || !data || data.length < 1 ? (
        <Fallback isLoading={isLoading} isError={error ? true : false} noData={true} type={'vestingStreams'} />
      ) : (
        <VestingTable data={data} />
      )}
    </section>
  );
}
