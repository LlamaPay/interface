import Fallback from 'components/FallbackList';

export default function DisperseFallback({
  isLoading,
  isError,
  noData,
}: {
  isLoading: boolean;
  isError: boolean;
  noData: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="mb-5">
        <div className="flex w-full flex-wrap items-center space-x-2">
          <label className="flex-1">
            <span className="sr-only">Enter Amount to Disperse</span>
            <input className="input-field mt-0 flex-1" placeholder="0.0" disabled />
          </label>
          <button
            type="button"
            className="rounded border border-[#1BDBAD] bg-white py-2 px-4 text-sm font-normal text-[#23BD8F]"
            disabled
          >
            Split Equally
          </button>
        </div>
        <div className="mt-[5px] flex flex-wrap items-center justify-between gap-4 rounded bg-[#E7E7E7]/40 px-2 py-1 text-xs text-[#4E575F]">
          <span>Available To Disperse</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button disabled type="button" className="rounded-3xl border bg-white px-3 py-[6px] text-xs">
          Select All
        </button>
        <button disabled type="button" className="rounded-3xl border bg-white px-3 py-[6px] text-xs">
          Unselect All
        </button>
      </div>
      <Fallback isLoading={isLoading} isError={isError} noData={noData} type="payeesList" />
    </div>
  );
}
