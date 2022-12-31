import { ReactNode } from 'react';
import Image from 'next/image';
import { DisclosureState } from 'ariakit';
import Tooltip from '~/components/Tooltip';
import heroGraphic from '~/public/heroGraphic.svg';
import Yearn from './Icons/Yearn';
import Convex from './Icons/Convex';
import Vector from './Icons/Vector';
import Beefy from './Icons/Beefy';
import Frax from './Icons/Frax';
import Fantom from './Icons/Fantom';
import DefiLlama from './Icons/DefiLlama';
import Spookyswap from './Icons/Spookyswap';
import Curve from './Icons/Curve';
import classNames from 'classnames';

export default function Hero({ walletDialog }: { walletDialog: DisclosureState }) {
  return (
    <div className="relative isolate flex flex-col flex-wrap gap-5 overflow-clip bg-lp-secondary p-10 text-lp-gray-5 dark:bg-lp-green-4 dark:text-lp-white sm:p-20 xl:p-24">
      <h1 className="font-exo relative z-10 text-5xl font-bold leading-[3.5rem]">
        Stream seamless <br /> recurring crypto <br /> payments!
      </h1>
      <p className="z-10 w-fit text-xl dark:opacity-80">
        Automate salaries by streaming them - so <br /> employees can withdraw whenever they want.{' '}
      </p>

      <div className="mt-[11px] mb-[64px] flex flex-col gap-5">
        <h2 className="font-exo text-xl font-medium">
          <span className="font-bold">Trusted </span>by remarkable organizations
        </h2>

        <div className="3xl:max-w-full z-10 flex flex-wrap gap-8 text-lp-white lg:max-w-xl">
          {users.map((user) => (
            <Tooltip content={user.name} key={user.name} className="hover:cursor-default">
              <div className={classNames('flex items-center', user.name === 'Curve Finance' && 'mr-[-10px]')}>
                {user.logo}
              </div>
            </Tooltip>
          ))}
        </div>
      </div>

      <button
        className="primary-button z-10 w-full max-w-[26.25rem] whitespace-pre-line border-none bg-lp-white text-lg font-semibold text-lp-primary dark:bg-lp-secondary dark:text-lp-black"
        onClick={walletDialog.toggle}
      >
        Connect your wallet to go to the app
      </button>

      <div className="hero-graphic">
        <Image src={heroGraphic} alt="" objectFit="contain" />
      </div>
    </div>
  );
}

interface IUser {
  name: string;
  logo: ReactNode;
}

const users: Array<IUser> = [
  { name: 'Beefy Finance', logo: <Beefy /> },
  {
    name: 'Convex Finance',
    logo: <Convex />,
  },
  {
    name: 'Curve Finance',
    logo: <Curve />,
  },
  {
    name: 'DefiLlama',
    logo: <DefiLlama />,
  },
  { name: 'Fantom Foundation', logo: <Fantom /> },
  {
    name: 'Frax Finance',
    logo: <Frax />,
  },
  { name: 'SpookySwap', logo: <Spookyswap /> },
  { name: 'Vector Finance', logo: <Vector /> },
  {
    name: 'Yearn Finance',
    logo: <Yearn />,
  },
];
