import * as React from 'react';
import { StreamCircle } from 'components/Icons';
import { closeBanner } from 'utils/banner';
import { DisclosureState } from 'ariakit';
import { useTranslations } from 'next-intl';

export default function Hero({ noBanner, onboardDialog }: { noBanner: boolean; onboardDialog: DisclosureState }) {
  const [displayBanner, setBanner] = React.useState(!noBanner);

  const t1 = useTranslations('Common');
  const t2 = useTranslations('Banner');

  if (!displayBanner) return <div className="h-[30px] dark:bg-[#161818]"></div>;

  return (
    <section className="relative -z-10 mb-[30px] flex flex-row flex-wrap items-center justify-center gap-6 bg-[#D9F2F4]/70 px-2 py-[52px] text-[#303030] dark:bg-[#151515]">
      <button
        className="absolute right-3 top-3 p-2"
        onClick={() => {
          closeBanner();
          setBanner(false);
        }}
      >
        <span className="sr-only dark:text-white">{t1('close')}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
            fill="#4E575F"
          />
        </svg>
      </button>
      <div className="relative left-[-12px] flex-shrink-0">
        <StreamCircle />
      </div>
      <h1 className="font-exo max-w-[16ch] text-4xl font-bold dark:text-white">{t2('heading')}</h1>
      <p
        className="relative flex max-w-md flex-col items-start justify-start gap-6 lg:top-[20px] 2xl:max-w-xl"
        style={{ lineHeight: '26px' }}
      >
        <span className="dark:text-white">{t2('description')}</span>
        <span className="flex gap-3">
          <button
            className="shadow-1 dark:font-hold rounded-[10px] border border-[#1BDBAD] bg-white py-[10px] px-10 font-bold text-[#23BD8F] dark:border-[#1BDBAD] dark:bg-[#23BD8F] dark:text-white"
            onClick={onboardDialog.toggle}
          >
            {t1('getStarted')}
          </button>
          {process.env.NEXT_PUBLIC_SAFE === 'false' ? (
            <a
              className="shadow-1 dark:font-hold rounded-[10px] border border-[#1BDBAD] bg-white py-[10px] px-10 font-bold
          text-[#23BD8F] dark:border-[#1BDBAD] dark:bg-[#23BD8F] dark:text-white"
              href="https://docs.llamapay.io/llamapay/gnosis-safe/adding-as-a-custom-app"
              target="_blank"
              rel="noreferrer noopener"
            >
              {'Use With Gnosis Safe'}
            </a>
          ) : (
            ''
          )}
        </span>
      </p>
    </section>
  );
}
