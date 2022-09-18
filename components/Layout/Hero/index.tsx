import * as React from 'react';
import { DisclosureState } from 'ariakit';
import graphic from './graphic.png';
import Image from 'next/image';

// TODO add translations
export default function Hero({ onboardDialog }: { onboardDialog: DisclosureState }) {
  return (
    <div className="relative flex flex-col flex-wrap gap-8 bg-lp-secondary p-[30px] text-lp-gray-5 dark:bg-[linear-gradient(262.4deg,#434346_11.63%,#525A5A_100%)] dark:text-lp-white md:px-[30px] lg:min-h-[420px] lg:p-[60px] xl:min-h-[0px] xl:px-[120px] xl:py-[100px]">
      <h1 className="font-exo z-10 max-w-[540px] text-5xl font-bold" style={{ lineHeight: '56px' }}>
        Stream seamless recurring crypto payments!
      </h1>
      <p className="z-10 w-fit max-w-[545px] text-lg backdrop-blur-xl">
        Automate salaries by streaming them - so employees can withdraw whenever they want.{' '}
      </p>
      <button
        className="primary-button w-full max-w-[420px] border-none bg-lp-white text-lg font-semibold text-lp-primary dark:bg-lp-secondary dark:text-lp-black"
        onClick={onboardDialog.toggle}
      >
        Start here
      </button>
      <div className="absolute right-0 z-0">
        <Image src={graphic} alt="" />
      </div>
    </div>
  );
}
