import * as React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { NetworksMenu, Account, WalletSelector } from 'components/Web3';
import { Logo } from 'components/Icons';
import { DisclosureState, useDialogState } from 'ariakit';
import Menu from './Menu';
import { useTranslations } from 'next-intl';

const Header = ({ onboardDialog }: { onboardDialog: DisclosureState }) => {
  const [{ data }] = useAccount();

  const walletDailog = useDialogState();

  const t = useTranslations('Header');

  return (
    <header
      className="flex items-center justify-between gap-10 bg-[#D9F4E6] text-base"
      style={{
        paddingInline: 'clamp(0.5rem, 2.5vw, 2rem)',
        paddingBlock: 'clamp(1rem, 2.5vh, 2rem)',
      }}
    >
      <Link href="/" passHref>
        <a className="flex-1">
          <Logo />
        </a>
      </Link>

      <nav className="flex flex-shrink-0 justify-between gap-[0.625rem] bg-[#D9F4E6] text-base">
        {data ? (
          <>
            <NetworksMenu />
            <Account showAccountInfo={walletDailog.toggle} />
          </>
        ) : (
          <button className="nav-button hidden md:block" onClick={walletDailog.toggle}>
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
