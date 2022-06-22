import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AppSwitch() {
  const router = useRouter();

  const isSalaries =
    router.pathname === '/' ||
    router.pathname.includes('/salaries') ||
    router.pathname === '/create' ||
    router.pathname === '/streams' ||
    router.pathname === '/withdraw';

  const isVesting = router.pathname.includes('/vesting');

  return (
    <span className="nav-button hidden items-center justify-between gap-3 py-[4px] px-[4px] dark:border-[#202020] dark:bg-[#202020] dark:text-white lg:flex">
      <Link href="/" passHref>
        <a className={classNames('py-1 px-2', isSalaries && 'rounded-2xl bg-[#23BD8F] text-white')}>Salaries</a>
      </Link>
      <Link href="/vesting" passHref>
        <a className={classNames('py-1 px-2', isVesting && 'rounded-2xl bg-[#23BD8F] text-white')}>Vesting</a>
      </Link>
    </span>
  );
}
