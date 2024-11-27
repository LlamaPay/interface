export default function Payer() {
  return (
    <>
      <div className="relative flex flex-col justify-between gap-5 rounded-[0.375rem] bg-lp-white px-11 pt-4 text-center dark:bg-lp-green-4 sm:text-lg">
        <h2 className="font-exo z-10 font-medium sm:text-2xl">Input payee information</h2>

        <div className="z-10 flex h-[11rem] flex-col gap-3 rounded-t-[1.25rem] bg-lp-secondary bg-opacity-50">
          <div className="flex h-6 items-center gap-1 rounded-t-3xl bg-lp-secondary bg-opacity-50 px-[10px] py-[6px]">
            <div className="h-3 w-3 rounded-full bg-lp-secondary"></div>
            <div className="h-3 w-3 rounded-full bg-lp-secondary"></div>
            <div className="h-3 w-3 rounded-full bg-lp-secondary"></div>
          </div>

          <div className="relative z-10 h-[46px]">
            <div className="absolute left-[-2px] right-[-2px] bottom-[-6px] h-[46px] rounded bg-lp-gray-1"></div>
            <div className="absolute left-[-10px] right-[-10px] flex h-[46px] items-center justify-start rounded border border-lp-gray-1 bg-lp-white p-3 text-xs text-lp-gray-2">
              0x...
            </div>
          </div>

          <div className="relative z-10 mt-[6px] h-[46px]">
            <div className="absolute left-[-2px] right-[-2px] bottom-[-6px] h-[46px] rounded bg-lp-gray-1"></div>
            <div className="absolute left-[-10px] right-[-10px] flex h-[46px] items-center justify-start rounded border border-lp-gray-1 bg-lp-white p-3 text-xs text-lp-gray-2">
              Alice - Designer
            </div>
          </div>
        </div>

        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 dark:hidden"
        >
          <circle
            cx="29.8436"
            cy="29.844"
            r="29.1573"
            transform="rotate(142.893 29.8436 29.844)"
            fill="url(#paint0_linear_912_53529)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_912_53529"
              x1="29.8436"
              y1="0.686712"
              x2="13.9054"
              y2="44.2491"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#D9F4E6" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <svg
          width="127"
          height="127"
          viewBox="0 0 127 127"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-3 right-3 dark:hidden"
        >
          <circle
            cx="63.3153"
            cy="63.316"
            r="63.0459"
            transform="rotate(142.893 63.3153 63.316)"
            fill="url(#paint0_linear_912_53530)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_912_53530"
              x1="63.3153"
              y1="0.270111"
              x2="28.8527"
              y2="94.4637"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#D9F4E6" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative flex flex-col justify-between gap-5 rounded-[0.375rem] bg-lp-white px-11 pt-4 text-center dark:bg-lp-green-4 sm:text-lg">
        <h2 className="font-exo z-10 font-medium sm:text-2xl">Enter amount & frequency</h2>

        <div className="z-10 flex h-[11rem] flex-col gap-3 rounded-t-[1.25rem] bg-lp-secondary bg-opacity-50">
          <div className="flex h-6 items-center gap-1 rounded-t-3xl bg-lp-secondary bg-opacity-50 px-[10px] py-[6px]">
            <div className="h-3 w-3 rounded-full bg-lp-secondary"></div>
            <div className="h-3 w-3 rounded-full bg-lp-secondary"></div>
            <div className="h-3 w-3 rounded-full bg-lp-secondary"></div>
          </div>

          <div className="relative z-10 h-[46px]">
            <div className="absolute left-[-2px] right-[-2px] bottom-[-6px] h-[46px] rounded bg-lp-gray-1"></div>
            <div className="absolute left-[-10px] right-[-10px] flex h-[46px] items-center justify-start rounded border border-lp-gray-1 bg-lp-white p-3 text-xs text-lp-gray-2">
              <div>4000</div>
              <div className="ml-auto flex items-center gap-[6px] rounded bg-[#D9D9D9] bg-opacity-40 p-1">
                <img
                  src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
                  alt=""
                  height={16}
                  width={16}
                />
                <div>USDC</div>
              </div>
              <select
                className="ml-2 mr-[-10px] rounded border border-lp-gray-1 pr-[32px] text-xs text-lp-gray-2"
                disabled
              >
                <option>Monthly</option>
              </select>
            </div>
          </div>
        </div>

        <svg
          width="83"
          height="83"
          viewBox="0 0 83 83"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 dark:hidden"
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
          className="absolute bottom-0 right-0 left-0 mx-auto dark:hidden"
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

      <div className="relative flex flex-col justify-between gap-5 rounded-[0.375rem] bg-lp-white px-11 pt-4 text-center dark:bg-lp-green-4 sm:text-lg">
        <h2 className="font-exo z-10 font-bold sm:text-2xl">Start Streaming!</h2>

        <div className="z-10 flex h-[11rem] flex-col gap-3 rounded-t-[1.25rem] bg-lp-secondary bg-opacity-50">
          <div className="flex h-6 items-center gap-1 rounded-t-3xl bg-lp-secondary bg-opacity-50 px-[10px] py-[6px]">
            <div className="h-3 w-3 rounded-full bg-lp-secondary"></div>
            <div className="h-3 w-3 rounded-full bg-lp-secondary"></div>
            <div className="h-3 w-3 rounded-full bg-lp-secondary"></div>
          </div>

          <div className="relative z-10 h-[46px]">
            <div className="absolute left-[-2px] right-[-2px] bottom-[-6px] h-[46px] rounded bg-lp-gray-1"></div>
            <div className="absolute left-[-10px] right-[-10px] flex h-[46px] items-center justify-start rounded border border-lp-gray-1 bg-lp-white p-3 text-xs text-lp-gray-2">
              <div>2000/4000</div>
              <div className="ml-auto flex items-center gap-[6px] rounded bg-[#D9D9D9] bg-opacity-40 p-1">
                <img
                  src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
                  alt=""
                  height={16}
                  width={16}
                />
                <div>USDC</div>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-auto mb-6 max-w-[8.75rem] whitespace-nowrap rounded border border-[#a7a7a7] border-opacity-10 py-3 px-11 text-base font-normal text-lp-black text-opacity-20">
            Top Up
          </p>
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
    </>
  );
}
