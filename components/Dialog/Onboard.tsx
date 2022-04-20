import * as React from 'react';
import { DisclosureState } from 'ariakit';
import { Dialog } from 'ariakit/dialog';
import classNames from 'classnames';
import { useIsMounted } from 'hooks';
import { Connector, useAccount, useConnect } from 'wagmi';
import { StreamArrows } from 'components/Icons';
import { LlamaPay } from 'components/Icons/Llamapay';

interface IOnboardProps {
  dialog: DisclosureState;
  className?: string;
}

export function OnboardDialog({ dialog, className }: IOnboardProps) {
  const isMounted = useIsMounted();
  const [
    {
      data: { connectors },
      loading,
    },
    connect,
  ] = useConnect();

  const [{ data: accountData, loading: accountDataLoading }] = useAccount();

  const handleConnect = React.useCallback(
    async (connector: Connector) => {
      await connect(connector);
    },
    [connect]
  );

  // React.useEffect(() => {
  //   const id = setTimeout(() => {
  //     if (accountData && !accountDataLoading && dialog.visible) {
  //       dialog.toggle();
  //     }
  //   }, 1000);

  //   return () => clearTimeout(id);
  // }, [accountData, accountDataLoading, dialog]);

  const hideConnectors = loading || accountData;

  return (
    <Dialog
      state={dialog}
      className={classNames(
        'border-color[#EAEAEA] absolute top-8 left-4 right-4 bottom-8 z-50 m-auto mx-auto mt-auto flex max-h-[80vh] max-w-3xl flex-col overflow-auto rounded-2xl border bg-white shadow-[0px_0px_9px_-2px_rgba(0,0,0,0.16)] sm:left-8 sm:right-8 sm:flex-row',
        className
      )}
    >
      <section className="border-color[#EAEAEA] relative flex w-full flex-col justify-center bg-[#F9FDFB] p-7 sm:max-w-[16rem] sm:border-r">
        <button onClick={dialog.toggle} className="absolute top-4 right-4 sm:hidden">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
              fill="#4E575F"
            />
          </svg>
        </button>

        <h1 className="text-[2rem] font-bold">Welcome!</h1>
        <p className="font-inter my-8 text-sm font-semibold">
          Create streams of indefinite duration and just siphon money out of a pool, which makes it possible to top all
          streams up in a single operation and just provide money as it's needed to maintain them.
        </p>
        <a
          className="font-inter absolute bottom-7 text-xs underline"
          href="https://docs.llamapay.io/"
          target="_blank"
          rel="noreferrer noopener"
        >
          Learn More in our Docs
        </a>
      </section>
      <section className="relative flex flex-1 flex-col">
        <header className="border-color[#EAEAEA] flex items-baseline p-5 sm:border-b">
          <h1 className="flex-1 text-center text-2xl font-semibold">
            {hideConnectors ? 'Initializing' : 'Connect your wallet'}
          </h1>
          <button onClick={dialog.toggle} className="absolute top-[30px] right-[30px] hidden sm:inline">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
                fill="#4E575F"
              />
            </svg>
          </button>
        </header>
        <main className="mx-auto mt-12 flex w-full flex-1 flex-col gap-4 px-7 sm:mt-[104px] sm:max-w-[26rem]">
          {hideConnectors ? (
            <div className="relative mx-auto sm:mt-[35%]">
              <StreamArrows />
              <div className="absolute top-0 bottom-0 right-0 left-0 m-auto">
                <LlamaPay />
              </div>
            </div>
          ) : (
            <>
              {connectors.map((x) => (
                <button
                  key={x.id}
                  onClick={() => handleConnect(x)}
                  className="w-full rounded-xl border border-[#CDCDCD] p-2 py-4 font-bold text-[#4E575F]"
                >
                  {isMounted ? x.name : x.id === 'injected' ? x.id : x.name}
                </button>
              ))}
            </>
          )}
        </main>
        <p className="font-inter my-7 w-full px-5 text-center text-xs text-[#303030]">
          Connecting a wallet doesn't move funds
        </p>
      </section>
    </Dialog>
  );
}
