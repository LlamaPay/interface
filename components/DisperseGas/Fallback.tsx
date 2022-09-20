import Fallback from 'components/Fallback';
import { useTranslations } from 'next-intl';

export default function DisperseFallback({
  isLoading,
  isError,
  noData,
}: {
  isLoading: boolean;
  isError: boolean;
  noData: boolean;
}) {
  const t = useTranslations('Disperse');

  return (
    <div className="flex flex-col gap-2">
      <div className="mb-5">
        <div className="flex w-full flex-wrap items-center space-x-2">
          <label className="flex-1">
            <span className="sr-only">{t('amountToDisperse')}</span>
            <input className="input-field mt-0 flex-1" placeholder="0.0" disabled />
          </label>
          <button
            type="button"
            className="rounded border border-lp-secondary bg-white py-2 px-4 text-sm font-normal text-lp-primary dark:border-lp-secondary dark:bg-lp-primary dark:text-white"
            disabled
          >
            {t('splitEqually')}
          </button>
        </div>
        <div className="dark:text-white] mt-[5px] flex flex-wrap items-center justify-between gap-4 rounded bg-[#E7E7E7]/40 px-2 py-1 text-xs text-[#4E575F] dark:bg-[#252525]">
          <span>{t('availableToDisperse')}</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          disabled
          type="button"
          className="rounded-3xl border bg-white px-3 py-[6px] text-xs dark:border-[#252525] dark:bg-[#252525]"
        >
          {t('selectAll')}
        </button>
        <button
          disabled
          type="button"
          className="rounded-3xl border bg-white px-3 py-[6px] text-xs dark:border-[#252525] dark:bg-[#252525]"
        >
          {t('unselectAll')}
        </button>
      </div>
      <Fallback isLoading={isLoading} isError={isError} noData={noData} type="payeesList" />
    </div>
  );
}
