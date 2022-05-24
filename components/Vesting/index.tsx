import Link from 'next/link';
import useGetVestingInfo from 'queries/useGetVestingInfo';
import { VestingTable } from './Table';

export default function VestingPage() {
  const { data } = useGetVestingInfo();

  return (
    <section className="w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between">
        <h1 className="font-exo dark:text-white">{'Vesting'}</h1>
        <Link href="/vesting-create">
          <a className="primary-button text-md py-2 px-5 text-center font-bold">{'Create Contract'}</a>
        </Link>
      </div>
      {data && <VestingTable data={data} />}
    </section>
  );
}
