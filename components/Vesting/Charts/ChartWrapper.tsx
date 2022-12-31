import dynamic from 'next/dynamic';
import { FallbackContainer } from '~/components/Fallback';

const VestingChart = dynamic(() => import('./VestingChart'), { ssr: false });

interface IChartProps {
  vestedAmount: string;
  vestingTime: string;
  vestingDuration: string;
  cliffTime: string;
  cliffDuration: string;
  startDate: string;
  includeCustomStart: boolean;
  includeCliff: boolean;
  hideFallback?: boolean;
}

const Fallback = () => (
  <FallbackContainer>
    <p className="text-center">Enter valid data to view chart</p>
  </FallbackContainer>
);

const isValidDate = (date: string) => new Date(date).toString() !== 'Invalid Date';

const ChartWrapper = ({
  vestedAmount,
  vestingTime,
  vestingDuration,
  cliffDuration,
  cliffTime,
  startDate,
  includeCustomStart,
  includeCliff,
  hideFallback,
}: IChartProps) => {
  const vesAmount = Number(vestedAmount);
  const vesTime = Number(vestingTime);
  const clfTime = Number(cliffTime);

  if (
    vestedAmount === '' ||
    Number.isNaN(vesAmount) ||
    vestingTime === '' ||
    Number.isNaN(vesTime) ||
    vestingDuration === '' ||
    (includeCliff && Number.isNaN(clfTime)) ||
    (includeCustomStart && (startDate === '' || !isValidDate(startDate)))
  ) {
    return hideFallback ? <> </> : <Fallback />;
  }

  const vestingPeriod = Number(vestingTime) * (vestingDuration === 'year' ? 365 : vestingDuration === 'month' ? 30 : 7);

  const cliffPeriod = includeCliff
    ? Number(cliffTime) * (cliffDuration === 'year' ? 365 : cliffDuration === 'month' ? 30 : 7)
    : null;

  if (cliffPeriod && cliffPeriod > vestingPeriod) {
    return hideFallback ? <> </> : <Fallback />;
  }

  const startTime = includeCustomStart && startDate !== '' ? new Date(startDate) : new Date(Date.now());

  return (
    <div className="h-[360px]">
      <VestingChart
        amount={Number(vestedAmount)}
        vestingPeriod={vestingPeriod}
        cliffPeriod={cliffPeriod}
        startTime={startTime}
      />
    </div>
  );
};

export default ChartWrapper;
