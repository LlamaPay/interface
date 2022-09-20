import Image from 'next/image';
import { DisclosureState, Select, SelectArrow, SelectLabel, useSelectState } from 'ariakit';
import { InputAmountWithDuration } from 'components/Form';
import { StreamIcon } from 'components/Icons';
import gasEfficient from 'public/gasEfficient.svg';
import multiChain from 'public/multiChain.svg';

// TODO add translations
export default function HowItWorks({ onboardDialog }: { onboardDialog: DisclosureState }) {
  const select = useSelectState();

  return (
    <div className="mb-[-5rem] flex flex-col items-center justify-between gap-16 bg-lp-green-1 py-[4.5rem] px-[1.875rem] text-lp-gray-5 dark:bg-lp-gray-5 dark:text-lp-white lg:px-[3.75rem] xl:px-[145px]">
      <div className="space-y-4">
        <h2 className="font-exo mx-auto flex flex-col text-center text-[2.5rem] leading-[3rem]">
          <span className="font-bold">Automate transactions</span>
          <span>and stream them by the second.</span>
        </h2>
        <p className="max-w-[56rem] text-center text-xl">
          LlamaPay is a multi-chain protocol that allows you to automate transactions and stream them by the second.
          Recipients can withdraw these funds at any time, eliminating the need for manual reoccuring payment
          transactions.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:w-full lg:flex-row">
        {features.map((feature) => (
          <article
            key={feature.name}
            className="flex max-w-xl flex-1 flex-col flex-nowrap gap-4 rounded-[0.375rem] bg-lp-green-2 p-6 text-xl dark:bg-lp-green-4 dark:bg-opacity-30 sm:flex-row sm:items-center sm:gap-10 lg:w-full lg:max-w-full"
          >
            <div className="h-[52px] flex-shrink-0 self-start sm:h-[88px] sm:self-center">
              <Image src={feature.logo} alt={feature.logo} objectFit="contain" />
            </div>
            <div className="flex flex-col gap-2 sm:gap-[0.625rem]">
              <h2 className="font-exo text-[1.875rem] font-bold">{feature.name}</h2>
              <p>{feature.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="flex w-full flex-col">
        <h2 className="font-exo mx-auto text-center text-[2.5rem] leading-10">
          How it <span className="font-bold">works</span>
        </h2>

        <span className="nav-button mx-auto my-4 flex w-fit items-center justify-between gap-3 py-1 px-1">
          <span className="flex-1 whitespace-nowrap rounded-[0.625rem] bg-lp-primary py-1 px-3 text-lp-white dark:text-lp-black">
            For Payers
          </span>
          <span className="flex-1 whitespace-nowrap py-1 px-3">For Payees</span>
        </span>

        <div className="my-4 mx-auto grid grid-cols-[repeat(1,minmax(0,26.25rem))] gap-4 xl:w-full xl:grid-cols-3">
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
                    <Image
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
                    <Image
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
        </div>

        <button
          className="nav-button mx-auto mt-[1.875rem] mb-[3.5rem] w-full max-w-[26.25rem] dark:bg-lp-secondary dark:text-lp-black"
          onClick={onboardDialog.toggle}
        >
          Start here
        </button>
      </div>

      <div className="grid grid-cols-1 gap-[0.625rem] lg:w-full lg:grid-cols-2">
        {pros.map((pro) => (
          <article
            key={pro.name}
            className="col-span-1 flex max-w-xl flex-col gap-[0.625rem] rounded-[0.375rem] bg-lp-white p-8 text-center text-xl dark:bg-lp-green-4 lg:max-w-full"
          >
            <h2 className="font-exo text-[1.875rem] font-bold dark:text-lp-primary">{pro.name}</h2>
            <p>{pro.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 flex w-[calc(100vw-16px)] select-none flex-col gap-20 lg:mb-[-4.5rem]">
        <h2 className="font-exo text-center text-[1.75rem]">
          Used by <span className="font-bold">employees and employers</span>
        </h2>

        <div className="flex w-full flex-col items-center bg-lp-green-3 dark:bg-lp-gray-3">
          <div className="relative z-20 mt-[-2.25rem] mb-[-3.75rem] flex flex-col gap-[0.625rem] rounded-[0.375rem] bg-lp-white px-6 py-10 shadow-[0px_4px_12px_rgba(0,0,0,0.15)] dark:bg-lp-green-4">
            <h1 className="font-exo flex items-center gap-[0.375rem] text-4xl font-semibold text-lp-gray-4 dark:text-white">
              <StreamIcon />
              <span>Create a New Stream</span>
            </h1>

            <label>
              <span className="input-label">Enter the recipients address</span>
              <input
                className="input-field text-sm font-semibold placeholder:text-lp-gray-4 dark:placeholder:text-lp-silver"
                placeholder="0x..."
                disabled
              />
            </label>

            <label>
              <span className="input-label">Add a nickname</span>
              <input
                placeholder="Alice"
                className="input-field text-sm font-semibold placeholder:text-lp-gray-4 dark:placeholder:text-lp-silver"
                disabled
              />
            </label>

            <SelectLabel state={select} className="input-label mt-1 mb-[-0.5rem] dark:text-white">
              Select token
            </SelectLabel>
            <Select state={select} className="input-field flex w-full items-center gap-1 !py-0" disabled>
              <Image
                src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
                alt=""
                height={20}
                width={20}
              />
              <span className="mr-auto text-sm font-semibold text-lp-gray-4 dark:text-lp-silver">USDC</span>
              <SelectArrow />
            </Select>

            <InputAmountWithDuration
              name=""
              placeholder="5000"
              selectInputName=""
              label="Amount to Stream"
              isRequired={false}
              className="text-sm font-semibold text-lp-gray-4 placeholder:text-lp-gray-4 dark:text-lp-silver dark:placeholder:text-lp-silver"
              disabled
            />

            <button className="form-submit-button mt-2 mb-3 disabled:cursor-default" disabled>
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    name: 'Gas efficient',
    description: 'Deploying a LlamaPay stream is 3.2-3.7x cheaper than other services.',
    logo: gasEfficient,
  },
  {
    name: 'Multi-chain',
    description: 'Available on all EVM chains with all contracts sharing the same address across chains',
    logo: multiChain,
  },
];

const pros = [
  {
    name: 'Anyone can trigger a claim',
    description: 'Receive payment into centralized exchanges via a 3rd party wallet triggering the claim.',
  },
  {
    name: 'Never run out of balance',
    description: 'Opt to borrow money to fund streams, for when you forget to top-up your balance.',
  },
  {
    name: 'No precision errors',
    description: 'LlamaPay operates internally with 20 decimals which will keep precision errors to a minimum.',
  },
  {
    name: 'Stream indefinitely',
    description: 'Use LlamaPay to create streams with no end date - or set a custom end date. ',
  },
];
