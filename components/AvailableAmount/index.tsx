import Image from 'next/image';
import defaultImage from 'public/empty-token.webp';
import { ITokenBalance } from 'queries/useTokenBalances';

export default function AvailableAmount({
  selectedToken,
  title,
  amount,
}: {
  selectedToken: ITokenBalance | null;
  title: string;
  amount?: string;
}) {
  return (
    <div className="mt-[5px] flex flex-wrap items-center justify-between gap-4 rounded bg-[#E7E7E7]/40 px-2 py-1 text-xs text-[#4E575F]">
      <span>{title}</span>
      <div className="flex items-center gap-2 truncate">
        <div className="flex h-[14px] w-[14px] flex-shrink-0 items-center rounded-full">
          <Image
            src={selectedToken?.logoURI ?? defaultImage}
            alt={selectedToken ? 'Logo of token ' + selectedToken.name : 'Fallback'}
            width="14px"
            height="14px"
          />
        </div>
        <p>{selectedToken && `${amount || selectedToken.balance} ${selectedToken.symbol}`}</p>
      </div>
    </div>
  );
}
