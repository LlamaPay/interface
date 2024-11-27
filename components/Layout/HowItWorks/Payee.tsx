import { ArrowDownIcon } from '@heroicons/react/24/outline';

export default function Payee() {
  return (
    <div className="relative flex flex-col justify-between gap-5 rounded-[0.375rem] bg-lp-white px-11 pt-4 text-center dark:bg-lp-green-4 sm:text-lg xl:col-start-2">
      <h2 className="font-exo z-10 font-medium sm:text-2xl">Claim Stream</h2>

      <div className="z-10 flex h-[11rem] flex-col gap-3 rounded-t-[1.25rem] bg-lp-secondary bg-opacity-50">
        <div className="flex h-6 items-center gap-1 rounded-t-3xl bg-lp-secondary bg-opacity-50 px-[10px] py-[6px]">
          <div className="h-3 w-3 rounded-full bg-lp-secondary"></div>
          <div className="h-3 w-3 rounded-full bg-lp-secondary"></div>
          <div className="h-3 w-3 rounded-full bg-lp-secondary"></div>
        </div>

        <div className="relative z-10 h-[46px]">
          <div className="absolute left-[-2px] right-[-2px] bottom-[-6px] h-[46px] rounded bg-lp-gray-1"></div>
          <div className="absolute left-[-10px] right-[-10px] flex h-[46px] items-center justify-start rounded border border-lp-gray-1 bg-lp-white p-3 text-xs text-lp-gray-2">
            <div className="mr-3 rounded-lg bg-gray-200 bg-opacity-40 p-[6px]">
              <ArrowDownIcon className="h-3 w-3 text-lp-primary" />
            </div>

            <div className="flex items-center gap-1">
              <img
                src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
                alt=""
                height={16}
                width={16}
              />
              <div>5000 USDC</div>
            </div>

            <div className="ml-auto flex items-center gap-[6px] rounded bg-[#D9D9D9] bg-opacity-40 p-1">Withdraw</div>
          </div>
        </div>
      </div>

      <svg
        width="83"
        height="83"
        viewBox="0 0 83 83"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute right-10 top-[-12px] dark:hidden"
      >
        <circle
          cx="41.4189"
          cy="41.419"
          r="40.9898"
          transform="rotate(142.893 41.4189 41.419)"
          fill="url(#paint0_linear_912_53526)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_912_53526"
            x1="41.4189"
            y1="0.429226"
            x2="19.0127"
            y2="61.6699"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D9F4E6" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      <svg
        width="83"
        height="83"
        viewBox="0 0 83 83"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-2 bottom-8 dark:hidden"
      >
        <circle
          cx="41.4189"
          cy="41.419"
          r="40.9898"
          transform="rotate(142.893 41.4189 41.419)"
          fill="url(#paint0_linear_912_53526)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_912_53526"
            x1="41.4189"
            y1="0.429226"
            x2="19.0127"
            y2="61.6699"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#D9F4E6" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
