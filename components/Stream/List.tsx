import { useStreamAndHistoryQuery } from 'services/generated/graphql';
import { ListItem } from './ListItem';

export const List = () => {
  const [{ data, error, fetching }] = useStreamAndHistoryQuery();

  if (fetching) return <Shimmers />;

  if (error) return <p className="mx-2 my-4 text-center text-red-500">Error loading data</p>;

  return (
    <ul className="flex flex-col space-y-4 p-2">
      {data?.user?.streams.map((stream) => (
        <ListItem key={stream.streamId} data={stream} />
      ))}
    </ul>
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
