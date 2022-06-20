import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AppSwitch() {
  const router = useRouter();
  return (
    <span className="nav-button hidden items-center justify-between gap-3 py-[4px] px-[4px] dark:border-[#202020] dark:bg-[#202020] dark:text-white lg:flex">
      <Link href="/" passHref>
        <a className={classNames('py-1 px-2', router.pathname === '/' && 'rounded-2xl bg-[#23BD8F] text-white')}>
          Salaries
        </a>
      </Link>
      <Link href="/vesting" passHref>
        <a className={classNames('py-1 px-2', router.pathname === '/vesting' && 'rounded-2xl bg-[#23BD8F] text-white')}>
          Vesting
        </a>
      </Link>
    </span>
  );
}
