import useGetSubgraphDelay from 'queries/useGetSubgraphDelay';
import React from 'react';

export default function StaleSubgraphWarning() {
  const { data } = useGetSubgraphDelay();

  if (!data || data?.timeDelay < 60) return null;

  return (
    <section className="h-[25px] bg-red-600 text-center text-white">
      <span className="font-exo text-sm">
        {`Subgraph is currently delayed by ${data.blockDelay} blocks (${(data.timeDelay / 60).toFixed(2)} minutes)`}
      </span>
    </section>
  );
}
