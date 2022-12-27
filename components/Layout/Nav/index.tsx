import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function Nav() {
  const router = useRouter();

  const isSalaries =
    router.pathname === '/' ||
    router.pathname.includes('/salaries') ||
    router.pathname === '/create' ||
    router.pathname === '/streams' ||
    router.pathname === '/withdraw' ||
    router.pathname === '/yearn';

  const isVesting = router.pathname.includes('/vesting');

  const isPayments = router.pathname.includes('/payments');

  const isTokenSalaries = router.pathname.includes('/token-salaries');

  return (
    <nav className="hidden min-w-[224px] flex-col gap-[10px] px-8 lg:flex">
      <Link href="/" passHref>
        <a className={classNames('font-medium', isSalaries && activeClasses)}>Salaries</a>
      </Link>
      <Link href="/vesting" passHref>
        <a className={classNames('font-medium', isVesting && activeClasses)}>Vesting</a>
      </Link>
      <Link href="/payments" passHref>
        <a className={classNames('font-medium', isPayments && activeClasses)}>Payments</a>
      </Link>
      <Link href="/token-salaries" passHref>
        <a className={classNames('font-medium', isTokenSalaries && activeClasses)}>Token Salaries</a>
      </Link>

      <span className="my-6 h-[1px] bg-llama-teal-2 dark:bg-lp-gray-7" />

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

const activeClasses = 'text-llama-green-500 dark:text-lp-white';
