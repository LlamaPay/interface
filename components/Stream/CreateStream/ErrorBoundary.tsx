const ErrorBoundary = ({ message }: { message: string }) => {
  return (
    <div className="rounded border p-2 dark:border-zinc-800">
      <p className="mx-2 my-4 text-center text-sm text-red-500">{message}</p>
    </div>
  );
};

export default ErrorBoundary;
