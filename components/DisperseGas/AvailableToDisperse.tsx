import Image from 'next/image';
import { chainDetails } from 'utils/network';
import { useBalance, useNetwork } from 'wagmi';
import defaultImage from 'public/empty-token.webp';
import { useLocale } from 'hooks';

export default function AvailableToDisperse({ id }: { id: string }) {
  const [{ data: balance, loading }] = useBalance({
    addressOrName: id.toLowerCase(),
  });

  const [{ data, loading: networkLoading }] = useNetwork();

  const { network } = chainDetails(data?.chain?.id.toString() ?? '0');

  const { locale } = useLocale();

  return (
    <div className="mt-[5px] flex flex-wrap items-center justify-between gap-4 rounded bg-[#E7E7E7]/40 px-2 py-1 text-xs text-[#4E575F]">
      <span>Available To Disperse</span>
      {networkLoading || loading ? (
        <div></div>
      ) : (
        <div className="flex items-center gap-1">
          <div className="flex h-[14px] w-[14px] flex-shrink-0 items-center rounded-full">
            <Image
              src={network?.logoURI ?? defaultImage}
              alt={'Logo of token ' + data?.chain?.name ?? 'Unsupported Token'}
              width="14px"
              height="14px"
            />
          </div>
          <p>
            {balance &&
              `${(Number(balance?.value) / 1e18).toLocaleString(locale, { maximumFractionDigits: 5 })} ${
                balance?.symbol
              }`}
          </p>
        </div>
      )}
    </div>
  );
}
