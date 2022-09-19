import { DisclosureState } from 'ariakit';
import GasEfficient from './GasEfficient';
import { MultiChain } from './MultiChain';

// TODO add translations
export default function HowItWorks({ onboardDialog }: { onboardDialog: DisclosureState }) {
  return (
    <div className="flex flex-col items-center justify-between gap-16 bg-lp-green-1 py-[72px] px-[30px] text-base text-lp-gray-5 dark:bg-lp-gray-5 dark:text-lp-white lg:px-[60px] xl:px-[120px]">
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
        <div className="flex flex-1 flex-col flex-nowrap gap-4 rounded-[6px] bg-lp-green-2 p-6 text-lg dark:bg-lp-green-4 dark:bg-opacity-30 sm:flex-row sm:items-center sm:gap-10">
          <GasEfficient />
          <div className="flex flex-col gap-2 sm:gap-[10px]">
            <h2 className="font-exo text-[1.625rem] font-bold">Gas efficient</h2>
            <p>Deploying a LlamaPay stream is 3.2-3.7x cheaper than other services.</p>
          </div>
        </div>
        <div className="flex flex-1 flex-col flex-nowrap gap-4 rounded-[6px] bg-lp-green-2 p-6 text-lg dark:bg-lp-green-4 dark:bg-opacity-30 sm:flex-row sm:items-center sm:gap-10">
          <MultiChain />
          <div className="flex flex-col gap-2 sm:gap-[10px]">
            <h2 className="font-exo text-[1.625rem] font-bold">Multi-chain</h2>
            <p>Available on all EVM chains with all contracts sharing the same address across chains.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
