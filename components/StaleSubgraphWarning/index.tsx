import useGetSubgraphDelay from 'queries/useGetSubgraphDelay';
import React from 'react';

export default function StaleSubgraphWarning() {
  const [delayTime, setDelayTime] = React.useState<number | null | undefined>(null);
  const { data } = useGetSubgraphDelay();

  React.useEffect(() => {
    setDelayTime(data);
  }, [data]);

  if (delayTime === null || delayTime === undefined || delayTime < 60) return <></>;
  return (
    <section className="h-[25px] bg-red-600 text-center">
      <span className="font-exo text-sm">
        {`Subgraph is currently delayed by ${(delayTime / 60).toFixed(2)} minutes`}
      </span>
    </section>
  );
}
