import Fallback from 'components/FallbackList';
import useGetVestingInfo from 'queries/useGetVestingInfo';
import Table from './Table';
import { useNetworkProvider } from 'hooks';
import { networkDetails } from 'utils/constants';
import Link from 'next/link';
import classNames from 'classnames';

export default function VestingTable() {
  const { chainId } = useNetworkProvider();
  const vestingFactory = chainId ? networkDetails[chainId]?.vestingFactory : null;
  const { data, isLoading, error } = useGetVestingInfo();

  return (
    <section className="w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between">
        <h1 className="font-exo dark:text-white">{'Vesting'}</h1>
        <Link href="/vesting/create" aria-disabled={!vestingFactory}>
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
        <Fallback
          isLoading={isLoading}
          isError={error ? true : false}
          noData={true}
          type={'vestingStreams'}
          showLoader={true}
        />
      ) : (
        <Table data={data} />
      )}
    </section>
  );
}
