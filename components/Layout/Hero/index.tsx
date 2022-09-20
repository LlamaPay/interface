import Image, { StaticImageData } from 'next/image';
import { DisclosureState } from 'ariakit';
import Tooltip from 'components/Tooltip';
import heroGraphic from 'public/heroGraphic.svg';
import defillama from 'public/userIcons/defillama.jpeg';

// TODO add translations
export default function Hero({ onboardDialog }: { onboardDialog: DisclosureState }) {
  return (
    <div className="relative isolate flex flex-col flex-wrap gap-5 overflow-clip bg-lp-secondary px-8 py-10 text-lp-gray-5 dark:bg-lp-green-4 dark:text-lp-white sm:p-10 lg:p-[3.75rem] xl:px-[145px] xl:pt-[6.25rem]">
      <h1 className="font-exo relative top-[-0.375rem] z-10 text-5xl font-bold lg:top-[-0.75rem] lg:leading-[3.5rem]">
        Stream seamless <br /> recurring crypto <br /> payments!
      </h1>
      <p className="z-10 w-fit text-xl">
        Automate salaries by streaming them - so <br /> employees can withdraw whenever they want.{' '}
      </p>

      <div className="mt-[11px] mb-[64px] flex flex-col gap-3">
        <h2 className="font-exo text-lg font-medium">
          <span className="font-bold">Trusted </span>by remarkable organizations
        </h2>

        <div className="z-10 flex gap-2">
          {users.map((user) => (
            <>
              {!user.logo ? (
                <p>{user.name}</p>
              ) : (
                <Tooltip content={user.name} key={user.name}>
                  <Image
                    src={user.logo}
                    alt={user.name}
                    height={24}
                    width={24}
                    objectFit="contain"
                    className={user.name !== 'tubby cats' ? 'rounded-full' : ''}
                    priority
                  />
                </Tooltip>
              )}
            </>
          ))}
        </div>
      </div>

      <button
        className="primary-button z-10 w-full max-w-[26.25rem] border-none bg-lp-white text-lg font-semibold text-lp-primary dark:bg-lp-secondary dark:text-lp-black"
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

interface IUser {
  name: string;
  logo?: string | StaticImageData;
}

const users: Array<IUser> = [
  {
    name: 'Convex Finance',
    logo: 'https://defillama.com/icons/convex-finance.jpg',
  },
  {
    name: 'Curve Finance',
    logo: 'https://defillama.com/icons/curve.jpg',
  },
  { name: 'DefiLlama', logo: defillama },
  { name: 'Fantom Foundation', logo: 'https://defillama.com/icons/fantom.jpg' },
  {
    name: 'Frax Finance',
    logo: 'https://defillama.com/icons/frax-finance.jpg',
  },
  { name: 'SpookySwap', logo: 'https://defillama.com/icons/spookyswap.jpg' },
  {
    name: 'Yearn Finance',
    logo: 'https://defillama.com/icons/yearn-finance.jpg',
  },
  { name: 'BiFi', logo: 'https://defillama.com/icons/bifi.jpg' },
];
