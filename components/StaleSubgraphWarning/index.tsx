import useGetSubgraphDelay from 'queries/useGetSubgraphDelay';
import React from 'react';

export default function StaleSubgraphWarning() {
  const [delayTime, setDelayTime] = React.useState<number | null | undefined>(null);
  const [delayBlocks, setDelayBlocks] = React.useState<number | null | undefined>(null);
  const { data } = useGetSubgraphDelay();

  React.useEffect(() => {
    setDelayTime(data?.timeDelay);
    setDelayBlocks(data?.blockDelay);
  }, [data]);

  if (!delayTime || !delayBlocks || delayTime < 60) return <></>;
  return (
    <section className="h-[25px] bg-red-600 text-center text-white">
      <span className="font-exo text-sm">
        {`Subgraph is currently delayed by ${delayBlocks} blocks (${(delayTime / 60).toFixed(2)} minutes)`}
      </span>
    </section>
  );
}
