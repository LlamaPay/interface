import * as React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function Nav() {
  const router = useRouter();

  return (
    <nav className="hidden min-w-[224px] flex-col gap-3 px-8 lg:flex">
      <Group name="Incoming" isOpen={router.pathname.includes('/incoming')}>
        <LinkItem name="Dashboard" href="/incoming/dashboard" isActive={router.pathname === '/incoming/dashboard'} />
        <Spacer />
        <LinkItem name="Salaries" href="/incoming/salaries" isActive={router.pathname === '/incoming/salaries'} />
        <Spacer />
        <LinkItem name="Vesting" href="/incoming/vesting" isActive={router.pathname === '/incoming/vesting'} />
        <Spacer />
        <LinkItem name="Payments" href="/incoming/payments" isActive={router.pathname === '/incoming/payments'} />
        <Spacer />
        <LinkItem
          name="Token Salaries"
          href="/incoming/token-salaries"
          isActive={router.pathname === '/incoming/token-salaries'}
        />
      </Group>

      <Group name="Outgoing" isOpen={router.pathname.includes('/outgoing')}>
        <LinkItem name="Dashboard" href="/outgoing/dashboard" isActive={router.pathname === '/outgoing/dashboard'} />
        <Spacer />
        <LinkItem name="Salaries" href="/outgoing/salaries" isActive={router.pathname === '/outgoing/salaries'} />
        <Spacer />
        <LinkItem name="Vesting" href="/outgoing/vesting" isActive={router.pathname === '/outgoing/vesting'} />
        <Spacer />
        <LinkItem name="Payments" href="/outgoing/payments" isActive={router.pathname === '/outgoing/payments'} />
        <Spacer />
        <LinkItem
          name="Token Salaries"
          href="/incoming/token-salaries"
          isActive={router.pathname === '/incoming/token-salaries'}
        />
      </Group>

      <span className="my-3 h-[1px] bg-llama-teal-2 dark:bg-lp-gray-7" />

      <a
        href="https://docs.llamapay.io/llamapay/gnosis-safe/adding-as-a-custom-app"
        target="_blank"
        rel="noreferrer noopener"
        className="flex w-full items-center justify-between gap-4 font-normal"
      >
        Gnosis Safe
      </a>

      <a
        href="https://github.com/banteg/ape-llamapay"
        target="_blank"
        rel="noreferrer noopener"
        className="flex w-full items-center justify-between gap-4 font-normal"
      >
        Ape SDK
      </a>
    </nav>
  );
}

const Group = ({ name, isOpen, children }: { name: string; isOpen: boolean; children: React.ReactNode }) => {
  return (
    <details className="select-none" open={isOpen}>
      <summary className="cursor-pointer list-none font-semibold">{name}</summary>
      <ul className="my-3">{children}</ul>
    </details>
  );
};

const Spacer = () => {
  return (
    <li className="border-l border-llama-gray-300 px-2 dark:border-lp-gray-7">
      <div className="h-[0.5rem]"></div>
    </li>
  );
};

const LinkItem = ({ isActive, href, name }: { isActive: boolean; href: string; name: string }) => {
  return (
    <li
      className={classNames(
        'border-l border-llama-gray-300 px-2 dark:border-lp-gray-7',
        isActive && '!border-llama-green-500'
      )}
    >
      <Link
        href={href}
        className={classNames('text-sm font-medium', isActive && 'font-bold text-llama-green-500 dark:text-lp-white')}
      >
        {name}
      </Link>
    </li>
  );
};
