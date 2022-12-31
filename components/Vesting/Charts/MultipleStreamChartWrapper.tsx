import { Control, useWatch } from 'react-hook-form';
import ChartWrapper from './ChartWrapper';
import type { IVestingGnosisFormValues } from '../types';

export default function MultipleStreamChartWrapper({
  control,
  index,
}: {
  control: Control<IVestingGnosisFormValues, any>;
  index: number;
}) {
  const vestedAmount = useWatch({
    control,
    name: `vestingContracts.${index}.vestedAmount`,
  });
  const vestingTime = useWatch({
    control,
    name: `vestingContracts.${index}.vestingTime`,
  });
  const vestingDuration = useWatch({
    control,
    name: `vestingContracts.${index}.vestingDuration`,
  });
  const includeCliff = useWatch({
    control,
    name: `vestingContracts.${index}.includeCliff`,
  });
  const cliffTime = useWatch({
    control,
    name: `vestingContracts.${index}.cliffTime`,
  });
  const cliffDuration = useWatch({
    control,
    name: `vestingContracts.${index}.cliffDuration`,
  });
  const includeCustomStart = useWatch({
    control,
    name: `vestingContracts.${index}.includeCustomStart`,
  });
  const startDate = useWatch({
    control,
    name: `vestingContracts.${index}.startDate`,
  });

  return (
    <ChartWrapper
      {...{
        vestedAmount,
        vestingTime,
        vestingDuration,
        includeCliff,
        cliffTime,
        cliffDuration,
        includeCustomStart,
        startDate,
      }}
      hideFallback
    />
  );
}
