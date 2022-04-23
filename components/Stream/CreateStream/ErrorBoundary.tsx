const ErrorBoundary = ({ message }: { message: string }) => {
  return (
    <div className="flex h-14 w-full items-center justify-center rounded border border-dashed border-[#626262] text-xs font-semibold">
      <p>{message}</p>
    </div>
  );
};

export default ErrorBoundary;
