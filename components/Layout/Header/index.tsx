import * as React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { NetworksMenu, Account, WalletSelector } from 'components/Web3';
import { Logo } from 'components/Icons';
import { DisclosureState } from 'ariakit';
import Menu from './Menu';
import { useTranslations } from 'next-intl';
import AppSwitch from './AppSwitch';

const Header = ({ onboardDialog, walletDialog }: { onboardDialog: DisclosureState; walletDialog: DisclosureState }) => {
  const [{ data }] = useAccount();

  const t = useTranslations('Common');

  return (
    <header
      className="flex items-center justify-between gap-10 bg-lp-green-1 text-base dark:bg-lp-gray-5"
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
            <Account showAccountInfo={walletDialog.toggle} />
          </>
        ) : (
          <button className="nav-button hidden md:block" onClick={walletDialog.toggle}>
            {t('connectWallet')}
          </button>
        )}

        <Menu onboardDialog={onboardDialog} walletDialog={walletDialog} />
      </nav>

      <WalletSelector dialog={walletDialog} />
    </header>
  );
};

export default Header;
