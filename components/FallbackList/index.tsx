interface FallbackProps {
  isLoading: boolean;
  error: unknown;
  data: unknown;
  noDataText: string;
  className?: string;
}

const FallbackList = ({ isLoading, data, error, noDataText, ...props }: FallbackProps) => {
  return (
    <>
      {isLoading ? (
        <ul className="space-y-4 rounded border p-2" {...props}>
          <li className="animate-shimmer h-5 bg-gray-400"></li>
          <li className="animate-shimmer h-5 bg-gray-400"></li>
          <li className="animate-shimmer h-5 bg-gray-400"></li>
          <li className="animate-shimmer h-5 bg-gray-400"></li>
        </ul>
      ) : (
        <div className="rounded border p-2 dark:border-zinc-800" {...props}>
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
