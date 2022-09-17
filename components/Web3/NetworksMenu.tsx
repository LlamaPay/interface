import * as React from 'react';
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectPopover,
  useSelectState,
  SelectGroup,
  SelectGroupLabel,
  SelectSeparator,
} from 'ariakit/select';
import { SelectorIcon } from '@heroicons/react/solid';
import { useNetwork } from 'wagmi';
import { chainDetails } from 'utils/network';
import Image from 'next/image';
import defaultImage from 'public/empty-token.webp';
import { useTranslations } from 'next-intl';
import useGetStreamsOnAllNetworks from 'queries/useGetStreamsOnAllNetworks';

export const NetworksMenu = () => {
  const [{ data }, switchNetwork] = useNetwork();

  const { data: activeStreams } = useGetStreamsOnAllNetworks();

  const chain = data.chain;

  const select = useSelectState({
    defaultValue: data.chain?.id?.toString() ?? '0',
    sameWidth: true,
    gutter: 8,
  });

  const { network } = chainDetails(chain?.id?.toString());

  const t = useTranslations('Common');

  if (!data || !chain || !switchNetwork) return null;

  const allChains = data.chains.sort((a, b) => {
    const chain1 = activeStreams?.find((c) => c.id === a.id)?.streams ?? 0;
    const chain2 = activeStreams?.find((c) => c.id === b.id)?.streams ?? 0;

    if (!chain1 && !chain2) {
      return 0;
    }

    return chain2 - chain1;
  });

  const mainnets = allChains.filter((chain) => !chain.testnet);
  const testnets = allChains.filter((chain) => chain.testnet);

  return (
    <>
      <SelectLabel state={select} className="hidden sm:sr-only">
        {t('network')}
      </SelectLabel>
      <Select state={select} className="nav-button hidden items-center justify-between gap-2 sm:flex">
        <>
          <div className="flex h-5 w-5 items-center rounded-full">
            <Image
              src={network?.logoURI ?? defaultImage}
              alt={t('logoAlt', { name: network?.prefix })}
              objectFit="contain"
              width="20px"
              height="20px"
              priority
            />
          </div>
          <span>{chain.name ?? t('unsupported')}</span>
          <SelectorIcon className="relative right-[-4px] h-4 w-4 text-gray-400" aria-hidden="true" />
        </>
      </Select>
      {select.mounted && (
        <SelectPopover
          state={select}
          className="shadow-2 z-10 max-h-[280px] w-fit min-w-[12rem] overflow-y-auto rounded-xl border border-[#EAEAEA] bg-white p-2 dark:border-[#252525] dark:bg-[#202020] "
        >
          <SelectGroup>
            <SelectGroupLabel className="p-2 text-sm font-normal text-neutral-500 dark:text-white">
              Mainnets
            </SelectGroupLabel>
            {mainnets.map((value) => {
              const { network } = chainDetails(value?.id?.toString());
              return (
                <SelectItem
                  key={value.id}
                  value={value.id?.toString()}
                  className="flex cursor-pointer scroll-m-2 items-center gap-4 whitespace-nowrap p-2 font-normal text-[#666666] outline-none active-item:text-black active:text-black aria-disabled:opacity-40 dark:text-white"
                  onClick={() => switchNetwork(value.id)}
                >
                  <div className="flex h-5 w-5 flex-shrink-0 items-center rounded-full">
                    <Image
                      src={network?.logoURI ?? defaultImage}
                      alt={t('logoAlt', { name: value.name })}
                      objectFit="contain"
                      width="20px"
                      height="20px"
                      priority
                    />
                  </div>
                  <span>{value.name}</span>
                  <span className="ml-auto pl-4">{activeStreams?.find((s) => s.id === value.id)?.streams}</span>
                </SelectItem>
              );
            })}
          </SelectGroup>
          <SelectSeparator className="my-2" />
          <SelectGroup>
            <SelectGroupLabel className="p-2 text-sm font-normal text-neutral-500 dark:text-white">
              Testnets
            </SelectGroupLabel>
            {testnets.map((value) => {
              const { network } = chainDetails(value?.id?.toString());
              return (
                <SelectItem
                  key={value.id}
                  value={value.id?.toString()}
                  className="flex cursor-pointer scroll-m-2 items-center gap-4 whitespace-nowrap p-2 font-normal text-[#666666] outline-none active-item:text-black active:text-black aria-disabled:opacity-40 dark:text-white"
                  onClick={() => switchNetwork(value.id)}
                >
                  <div className="flex h-5 w-5 flex-shrink-0 items-center rounded-full">
                    <Image
                      src={network?.logoURI ?? defaultImage}
                      alt={t('logoAlt', { name: value.name })}
                      objectFit="contain"
                      width="20px"
                      height="20px"
                      priority
                    />
                  </div>
                  <span>{value.name}</span>
                  <span className="ml-auto pl-4">{activeStreams?.find((s) => s.id === value.id)?.streams}</span>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectPopover>
      )}
    </>
  );
};
