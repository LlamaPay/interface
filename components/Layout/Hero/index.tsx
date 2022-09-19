import * as React from 'react';
import { DisclosureState } from 'ariakit';

// TODO add translations
export default function Hero({ onboardDialog }: { onboardDialog: DisclosureState }) {
  return (
    <div className="isolate">
      <div className="h-12 bg-lp-secondary dark:bg-lp-green-4 sm:h-10 md:h-14 lg:h-[60px] xl:h-[100px]"></div>
      <div className="app-hero relative flex flex-col flex-wrap gap-6 bg-lp-secondary bg-contain bg-bottom bg-no-repeat bg-origin-border px-8 pb-12 !pt-0 text-lp-gray-5 dark:bg-lp-green-4 dark:text-lp-white sm:p-10 md:p-14 lg:gap-8 lg:p-[60px] xl:bg-right-top xl:px-[120px]">
        <h1 className="font-exo relative z-10 mt-[-6px] text-4xl font-bold lg:mt-[-12px] lg:max-w-[540px] lg:text-5xl lg:leading-[56px]">
          Stream seamless recurring crypto payments!
        </h1>
        <p className="z-10 w-fit max-w-[545px] text-lg lg:text-xl">
          Automate salaries by streaming them - so employees can withdraw whenever they want.{' '}
        </p>
        <button
          className="primary-button z-10 mt-8 w-full max-w-[420px] border-none bg-lp-white text-lg font-semibold text-lp-primary dark:bg-lp-secondary dark:text-lp-black lg:mt-20"
          onClick={onboardDialog.toggle}
        >
          Start here
        </button>
      </div>
    </div>
  );
}
