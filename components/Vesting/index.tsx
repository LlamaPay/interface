import useGetVestingInfo from 'queries/useGetVestingInfo';
import CreateVesting from './CreateVesting';
import { VestingTable } from './Table';

export default function VestingPage() {
  const { data } = useGetVestingInfo();

  return (
    <section className="w-full">
      <div className="section-header">
        <h1 className="font-exo dark:text-white">Vesting</h1>
        {data && <VestingTable data={data} />}
        <CreateVesting />
      </div>
    </section>
  );
}
