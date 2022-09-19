import * as React from 'react';
import { DisclosureState } from 'ariakit';
import heroGraphic from 'public/heroGraphic.svg';
import Image from 'next/image';

// TODO add translations
export default function Hero({ onboardDialog }: { onboardDialog: DisclosureState }) {
  return (
    <div className="relative isolate flex flex-col flex-wrap gap-6 overflow-clip bg-lp-secondary px-8 py-10 text-lp-gray-5 dark:bg-lp-green-4 dark:text-lp-white sm:p-10 lg:gap-8 lg:p-[60px] xl:px-[145px] xl:py-[100px]">
      <h1 className="font-exo relative top-[-6px] z-10 text-4xl font-bold lg:top-[-12px] lg:text-5xl lg:leading-[56px]">
        Stream seamless <br /> recurring crypto <br /> payments!
      </h1>
      <p className="z-10 w-fit text-lg lg:text-xl">
        Automate salaries by streaming them - so <br /> employees can withdraw whenever they want.{' '}
      </p>
      <button
        className="primary-button z-10 mt-8 w-full max-w-[420px] border-none bg-lp-white text-lg font-semibold text-lp-primary dark:bg-lp-secondary dark:text-lp-black lg:mt-20"
        onClick={onboardDialog.toggle}
      >
        Start here
      </button>

      <div className="hero-graphic">
        <Image src={heroGraphic} alt="" objectFit="contain" />
      </div>
    </div>
  );
}
