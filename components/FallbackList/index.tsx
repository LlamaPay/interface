interface FallbackProps {
  isLoading: boolean;
  error: unknown;
  data: unknown;
  noDataText: string;
}

const FallbackList = ({ isLoading, data, error, noDataText }: FallbackProps) => {
  return (
    <>
      {isLoading ? (
        <ul className="space-y-4 rounded border p-2">
          <li className="animate-shimmer m-2 h-5 bg-gray-400"></li>
          <li className="animate-shimmer m-2 h-5 bg-gray-400"></li>
          <li className="animate-shimmer m-2 h-5 bg-gray-400"></li>
          <li className="animate-shimmer m-2 h-5 bg-gray-400"></li>
        </ul>
      ) : (
        <div className="rounded border p-2 dark:border-zinc-800">
          {error ? (
            <p className="mx-2 my-4 text-center text-sm text-red-500">Something went wrong.</p>
          ) : !data ? (
            <p className="mx-2 my-4 text-center text-sm">{noDataText}</p>
          ) : null}
        </div>
      )}
    </>
  );
};

export default FallbackList;
