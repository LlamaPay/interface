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

  const isSubscriptions = router.pathname.includes('/subscriptions');

  return (
    <nav className="hidden min-w-[224px] flex-col gap-3 px-8 lg:flex">
      <Group name="Salaries" isOpen={isSalaries || router.pathname === '/create' || router.pathname === '/withdraw'}>
        <LinkItem name="Streams" href="/" isActive={isSalaries} />
        <Spacer />
        <LinkItem name="Create" href="/create" isActive={router.pathname === '/create'} />
        <Spacer />
        <LinkItem name="Withdraw" href="/withdraw" isActive={router.pathname === '/withdraw'} />
      </Group>

      <Group name="Vesting" isOpen={isVesting}>
        <LinkItem name="Streams" href="/vesting" isActive={isVesting && router.pathname !== '/vesting/create'} />
        <Spacer />
        <LinkItem name="Create" href="/vesting/create" isActive={router.pathname === '/vesting/create'} />
      </Group>

      <Group name="Payments" isOpen={isPayments}>
        <LinkItem name="Streams" href="/payments" isActive={isPayments && router.pathname !== '/payments/create'} />
        <Spacer />
        <LinkItem name="Create" href="/payments/create" isActive={router.pathname === '/payments/create'} />
      </Group>

      <Group name="Token Salaries" isOpen={router.pathname.includes('/token-salaries')}>
        <LinkItem
          name="Incoming"
          href="/token-salaries/incoming"
          isActive={router.pathname === '/token-salaries/incoming'}
        />
        <Spacer />
        <LinkItem
          name="Outgoing"
          href="/token-salaries/outgoing"
          isActive={router.pathname === '/token-salaries/outgoing'}
        />
        <Spacer />
        <LinkItem name="Create" href="/token-salaries/create" isActive={router.pathname === '/token-salaries/create'} />
      </Group>

      <Group name="Subscriptions" isOpen={isSubscriptions}>
        <LinkItem
          name="Incoming"
          href="/subscriptions/incoming"
          isActive={router.pathname === '/subscriptions/incoming'}
        />
        <Spacer />
        <LinkItem
          name="Outgoing"
          href="/subscriptions/outgoing"
          isActive={router.pathname === '/subscriptions/outgoing'}
        />
        <Spacer />
        <LinkItem name="Create" href="/subscriptions/create" isActive={router.pathname === '/subscriptions/create'} />
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
