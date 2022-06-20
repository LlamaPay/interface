import * as React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { NetworksMenu, Account, WalletSelector } from 'components/Web3';
import { Logo } from 'components/Icons';
import { DisclosureState, useDialogState } from 'ariakit';
import Menu from './Menu';
import { useTranslations } from 'next-intl';
import AppSwitch from './AppSwitch';

const Header = ({ onboardDialog }: { onboardDialog: DisclosureState }) => {
  const [{ data }] = useAccount();

  const walletDailog = useDialogState();

  const t = useTranslations('Common');

  return (
    <header
      className="flex items-center justify-between gap-10 bg-[#D9F4E6] text-base dark:bg-[#333336]"
      style={{
        paddingInline: 'clamp(0.5rem, 2.5vw, 2rem)',
        paddingBlock: 'clamp(1rem, 2.5vh, 2rem)',
      }}
    >
      <Link href="/" passHref>
        <a>
          <span className="sr-only">Navigate to Home Page</span>
          <Logo />
        </a>
      </Link>

      <nav className="flex flex-shrink-0 items-center justify-between gap-[0.625rem]">
        <AppSwitch />
        {data ? (
          <>
            <NetworksMenu />
            <Account showAccountInfo={walletDailog.toggle} />
          </>
        ) : (
          <button
            className="nav-button hidden dark:border-0 dark:bg-[#23BD8F] dark:text-white md:block"
            onClick={walletDailog.toggle}
          >
            {t('connectWallet')}
          </button>
        )}

        <Menu onboardDialog={onboardDialog} walletDialog={walletDailog} />
      </nav>
      <WalletSelector dialog={walletDailog} />
    </header>
  );
};

export default Header;
