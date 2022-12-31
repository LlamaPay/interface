import Image from 'next/image';
import { chainDetails } from '~/utils/network';
import { useNetwork } from 'wagmi';
import defaultImage from '~/public/empty-token.webp';
import { useGetNativeBalance } from '~/queries/useGetNativeBalance';
import { useIntl, useTranslations } from 'next-intl';

export default function AvailableToDisperse({ id }: { id: string }) {
  const [{ data: networkData, loading: networkLoading }] = useNetwork();

  const { data: nativeBalance, isLoading } = useGetNativeBalance(id);

  const { network } = chainDetails(networkData?.chain?.id.toString() ?? '0');

  const intl = useIntl();

  const balance =
    nativeBalance &&
    networkData?.chain &&
    Number(nativeBalance) / 10 ** Number(networkData?.chain?.nativeCurrency?.decimals);

  const t0 = useTranslations('Common');
  const t1 = useTranslations('Disperse');

  return (
    <div className="mt-[5px] flex flex-wrap items-center justify-between gap-4 rounded bg-[#E7E7E7]/40 px-2 py-1 text-xs text-[#4E575F] dark:bg-[#252525] dark:text-white">
      <span>{t1('availableToDisperse')}</span>
      {isLoading || networkLoading ? (
        <div></div>
      ) : (
        <div className="flex items-center gap-1">
          <div className="flex h-[14px] w-[14px] flex-shrink-0 items-center rounded-full">
            <Image
              src={network?.logoURI ?? defaultImage}
              alt={t0('logoAlt', { name: networkData?.chain?.name ?? 'Unsupported Token' })}
              width="14px"
              height="14px"
            />
          </div>
          <p>
            {balance &&
              `${intl.formatNumber(balance, { maximumFractionDigits: 5 })} ${
                networkData?.chain?.nativeCurrency?.symbol
              }`}
          </p>
        </div>
      )}
    </div>
  );
}
