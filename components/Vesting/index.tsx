import Fallback from 'components/FallbackList';
import useGetVestingInfo from 'queries/useGetVestingInfo';
import Table from './Table';
import { useNetworkProvider } from 'hooks';
import { networkDetails } from 'utils/constants';
import Link from 'next/link';
import classNames from 'classnames';
import { IVesting } from 'types';
import { useTranslations } from 'next-intl';

export default function VestingTable() {
  const { chainId } = useNetworkProvider();

  const vestingFactory = chainId ? networkDetails[chainId]?.vestingFactory : null;

  const { data, isLoading, error } = useGetVestingInfo();

  return (
    <section className="w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between">
        <h1 className="font-exo dark:text-white">Vesting</h1>
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

interface IAltVestingSectionProps {
  isLoading: boolean;
  isError: boolean;
  data?: IVesting[] | null;
}

export function AltVestingSection({ isLoading, isError, data }: IAltVestingSectionProps) {
  const t = useTranslations('Streams');

  return (
    <section className="w-full">
      <div className="section-header">
        <h1 className="font-exo dark:text-white">Streams</h1>
      </div>
      {isLoading || isError || !data || data.length < 1 ? (
        <div className="flex h-14 w-full items-center justify-center rounded border border-dashed border-[#626262] text-xs font-semibold">
          {isLoading ? null : isError ? (
            <p>{t('error')}</p>
          ) : !data || data.length < 1 ? (
            <p>{t('noActiveStreams')}</p>
          ) : null}
        </div>
      ) : (
        <Table data={data} />
      )}
    </section>
  );
}
