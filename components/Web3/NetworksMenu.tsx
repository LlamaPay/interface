import * as React from 'react';
import { Select, SelectItem, SelectLabel, SelectPopover, useSelectState } from 'ariakit/select';
import { SelectorIcon, CheckIcon } from '@heroicons/react/solid';
import { useNetwork } from 'wagmi';
import classNames from 'classnames';

export const NetworksMenu = () => {
  const [{ data }, switchNetwork] = useNetwork();

  const chain = data.chain;

  const select = useSelectState({
    defaultValue: data.chain?.id?.toString() ?? '0',
    sameWidth: true,
    gutter: 8,
  });

  if (!data || !chain || !switchNetwork) return null;

  const mainnets = data.chains.filter((chain) => !chain.testnet);
  // const testnets = data.chains.filter((chain) => chain.testnet);

  return (
    <>
      <SelectLabel state={select} className="sr-only">
        Network
      </SelectLabel>
      <Select state={select} className="nav-button flex items-center justify-between gap-2">
        <>
          <span>{chain.name ?? 'Unsupported'}</span>
          <SelectorIcon className="relative right-[-4px] h-4 w-4 text-gray-400" aria-hidden="true" />
        </>
      </Select>
      {select.mounted && (
        <SelectPopover
          state={select}
          className="shadow-2 z-10 w-fit min-w-[10rem] rounded-xl border border-[#EAEAEA] bg-white p-2"
        >
          {mainnets.map((value) => (
            <SelectItem
              key={value.id}
              value={value.id?.toString()}
              className="flex scroll-m-2 items-center gap-4 whitespace-nowrap p-2 font-normal text-[#666666] outline-none active-item:text-black active:text-black aria-disabled:opacity-40 cursor-pointer"
              onClick={() => switchNetwork(value.id)}
            >
              <div className="h-5 w-5">
                <CheckIcon
                  className={classNames('relative h-5 w-5', chain.id !== value.id && 'hidden')}
                  aria-hidden="true"
                />
              </div>
              {value.name}
            </SelectItem>
          ))}
        </SelectPopover>
      )}
    </>
  );
};
