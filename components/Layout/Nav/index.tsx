import * as React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function Nav() {
  const router = useRouter();

  const isSalaries =
    router.pathname === '/' ||
    router.pathname.includes('/salaries') ||
    router.pathname === '/streams' ||
    router.pathname === '/yearn';

  const isVesting = router.pathname.includes('/vesting');

  const isPayments = router.pathname.includes('/payments');

  const isTokenSalaries = router.pathname.includes('/token-salaries');

  return (
    <nav className="hidden min-w-[224px] flex-col gap-3 px-8 lg:flex">
      <Group name="Salaries" isOpen={isSalaries || router.pathname === '/create' || router.pathname === '/withdraw'}>
        <LinkItem name="Streams" href="/" isActive={isSalaries} />

        <LinkItem name="Create" href="/create" isActive={router.pathname === '/create'} />

        <LinkItem name="Withdraw" href="/withdraw" isActive={router.pathname === '/withdraw'} />
      </Group>

      <Group name="Vesting" isOpen={isVesting}>
        <LinkItem name="Streams" href="/vesting" isActive={isVesting && router.pathname !== '/vesting/create'} />

        <LinkItem name="Create" href="/create" isActive={router.pathname === '/vesting/create'} />
      </Group>

      <Group name="Payments" isOpen={isPayments}>
        <LinkItem name="Streams" href="/payments" isActive={isVesting && router.pathname !== '/payments/create'} />

        <LinkItem name="Create" href="/create" isActive={router.pathname === '/payments/create'} />
      </Group>

      <Group name="Token Salaries" isOpen={isTokenSalaries}>
        <LinkItem
          name="Scheduled Transfers"
          href="/token-salaries"
          isActive={isTokenSalaries && router.pathname !== '/token-salaries/create'}
        />

        <LinkItem name="Create" href="/token-salaries/create" isActive={router.pathname === '/token-salaries/create'} />
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

const LinkItem = ({ isActive, href, name }: { isActive: boolean; href: string; name: string }) => {
  return (
    <li
      className={classNames(
        'border-l border-llama-gray-300 px-2 pt-2 first-of-type:pt-0',
        isActive && 'border-llama-green-500'
      )}
    >
      <Link href={href} passHref>
        <a
          className={classNames('text-sm font-medium', isActive && 'font-bold text-llama-green-500 dark:text-lp-white')}
        >
          {name}
        </a>
      </Link>
    </li>
  );
};
