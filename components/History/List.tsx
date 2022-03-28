import { useStreamAndHistoryQuery } from 'services/generated/graphql';
import { ListItem } from './ListItem';

export const List = () => {
  // TODO handle error and loading states
  const { data, error, isLoading } = useStreamAndHistoryQuery();

  if (isLoading) return <Shimmers />;

  if (error) return <p className="mx-2 my-4 text-center text-red-500">Error loading data</p>;

  return (
    <section className="w-fit max-w-7xl">
      <h1 className="mb-3 text-center text-xl">History</h1>
      <ul className="isolate flex flex-col space-y-4 rounded border p-2">
        {data?.user?.historicalEvents.map((historyEvent) => (
          <ListItem key={historyEvent.txHash} data={historyEvent} />
        ))}
      </ul>
    </section>
  );
};

const Shimmers = () => {
  return (
    <ul>
      <li className="animate-shimmer m-2 h-5 bg-gray-400"></li>
      <li className="animate-shimmer m-2 h-5 bg-gray-400"></li>
      <li className="animate-shimmer m-2 h-5 bg-gray-400"></li>
      <li className="animate-shimmer m-2 h-5 bg-gray-400"></li>
    </ul>
  );
};
