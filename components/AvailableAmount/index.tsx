import { useTranslations } from 'next-intl';
import type { ITokenBalance } from '~/queries/useTokenBalances';

export default function AvailableAmount({
  selectedToken,
  title,
  amount,
}: {
  selectedToken: ITokenBalance | null;
  title: string;
  amount?: string;
}) {
  const t = useTranslations('Common');

  if (!selectedToken) return null;

  return (
    <div className="mt-[5px] flex flex-wrap items-center justify-between gap-4 rounded bg-[#E7E7E7]/40 px-2 py-1 text-xs text-[#4E575F] dark:bg-[#222222] dark:text-white">
      <span>{title}</span>
      <div className="flex items-center gap-2 truncate">
        <div className="flex h-[14px] w-[14px] flex-shrink-0 items-center rounded-full">
          <img src={selectedToken.logoURI} alt={t('logoAlt', { name: selectedToken.name })} width={14} height={14} />
        </div>
        <p className="dark:text-white">
          {selectedToken && `${amount || selectedToken.balance} ${selectedToken.symbol}`}
        </p>
      </div>
    </div>
  );
}
