import classNames from 'classnames';
import Fallback from 'components/FallbackList';
import { useNetworkProvider } from 'hooks';
import Link from 'next/link';
import useGetVestingInfo from 'queries/useGetVestingInfo';
import { networkDetails } from 'utils/constants';
import { VestingTable } from './Table';

export default function VestingPage() {
  const { data, isLoading, error } = useGetVestingInfo();

  const { chainId } = useNetworkProvider();

  const vestingFactory = chainId ? networkDetails[chainId]?.vestingFactory : null;

  return (
    <section className="w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between">
        <h1 className="font-exo dark:text-white">{'Vesting'}</h1>
        <Link href="/vesting-create" aria-disabled={!vestingFactory}>
          <a
            className={classNames(
              'primary-button text-md py-2 px-5 text-center font-bold',
              !vestingFactory && 'pointer-events-none opacity-50 hover:cursor-not-allowed'
            )}
            aria-disabled={!vestingFactory}
          >
            {'Create Contract'}
          </a>
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
