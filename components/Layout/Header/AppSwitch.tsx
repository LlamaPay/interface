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
    router.pathname === '/withdraw' ||
    router.pathname === '/yearn';

  const isVesting = router.pathname.includes('/vesting');

  return (
    <span className="nav-button hidden items-center justify-between gap-3 py-[4px] px-[4px] lg:flex">
      <Link href="/" passHref>
        <a className={classNames('py-1 px-2', isSalaries && activeClasses)}>Salaries</a>
      </Link>
      <Link href="/vesting" passHref>
        <a className={classNames('py-1 px-2', isVesting && activeClasses)}>Vesting</a>
      </Link>
    </span>
  );
}

const activeClasses = 'rounded-[10px] bg-lp-primary text-lp-white';
