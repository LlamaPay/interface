import { DisclosureState } from 'ariakit';
import GasEfficient from './GasEfficient';
import { MultiChain } from './MultiChain';

// TODO add translations
export default function HowItWorks({ onboardDialog }: { onboardDialog: DisclosureState }) {
  return (
    <div className="mb-[-5rem] flex flex-col items-center justify-between gap-16 bg-lp-green-1 py-[72px] px-[30px] text-base text-lp-gray-5 dark:bg-lp-gray-5 dark:text-lp-white lg:px-[60px] xl:px-[120px]">
      <div className="space-y-5">
        <h2 className="font-exo mx-auto flex flex-col text-center text-4xl">
          <span className="font-bold">Automate transactions</span>
          <span>and stream them by the second.</span>
        </h2>
        <p className="max-w-[56rem] text-center text-lg">
          LlamaPay is a multi-chain protocol that allows you to automate transactions and stream them by the second.
          Recipients can withdraw these funds at any time, eliminating the need for manual reoccuring payment
          transactions.
        </p>
      </div>

      <div className="mt-[11px] mb-[64px]">
        <h2 className="font-exo text-2xl font-medium">
          <span className="font-bold">Trusted </span>by remarkable organizations
        </h2>
        <div></div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {features.map((feature) => (
          <article
            key={feature.name}
            className="flex max-w-xl flex-1 flex-col flex-nowrap gap-4 rounded-[6px] bg-lp-green-2 p-6 dark:bg-lp-green-4 dark:bg-opacity-30 sm:flex-row sm:items-center sm:gap-10 sm:text-lg lg:max-w-full"
          >
            {feature.logo}
            <div className="flex flex-col gap-2 sm:gap-[10px]">
              <h2 className="font-exo text-xl font-bold sm:text-[1.625rem]">{feature.name}</h2>
              <p>{feature.description}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="flex flex-col">
        <h2 className="font-exo mx-auto text-center text-4xl">
          How it <span className="font-bold">works</span>
        </h2>

        <span className="nav-button mx-auto my-4 flex w-fit items-center justify-between gap-3 py-2 px-3">
          <span className="flex-1 whitespace-nowrap rounded-[10px] bg-lp-primary py-1 px-3 text-lp-white dark:text-lp-black">
            For Payers
          </span>
          <span className="flex-1 whitespace-nowrap py-1 px-3">For Payees</span>
        </span>

        <div className="my-4 flex flex-col gap-4 lg:flex-row">
          <div className="rounded-[6px] bg-lp-white py-4 px-11 text-center dark:bg-lp-green-4 sm:text-lg">
            <h2 className="font-exo font-medium sm:text-xl">Input payee information</h2>
          </div>
          <div className="rounded-[6px] bg-lp-white py-4 px-11 text-center dark:bg-lp-green-4 sm:text-lg">
            <h2 className="font-exo font-medium sm:text-xl">Enter amount & frequency</h2>
          </div>
          <div className="rounded-[6px] bg-lp-white py-4 px-11 text-center dark:bg-lp-green-4 sm:text-lg">
            <h2 className="font-exo font-medium sm:text-xl">Start Streaming!</h2>
          </div>
        </div>

        <button
          className="nav-button mx-auto mt-[30px] mb-[56px] w-full max-w-[420px] dark:bg-lp-secondary dark:text-lp-black"
          onClick={onboardDialog.toggle}
        >
          Start here
        </button>
      </div>

      <div className="grid grid-cols-1 gap-[10px] lg:grid-cols-2">
        {pros.map((pro) => (
          <article
            key={pro.name}
            className="col-span-1 flex max-w-xl flex-col gap-[10px] rounded-[6px] bg-lp-white p-8 text-center dark:bg-lp-green-4 sm:text-lg lg:max-w-full"
          >
            <h2 className="font-exo text-xl font-bold dark:text-lp-primary sm:text-[1.625rem]">{pro.name}</h2>
            <p>{pro.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

const features = [
  {
    name: 'Gas efficient',
    description: 'Deploying a LlamaPay stream is 3.2-3.7x cheaper than other services.',
    logo: <GasEfficient />,
  },
  {
    name: 'Multi-chain',
    description: 'Available on all EVM chains with all contracts sharing the same address across chains',
    logo: <MultiChain />,
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
