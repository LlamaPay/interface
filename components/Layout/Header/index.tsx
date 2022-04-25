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
    <header className="flex items-center justify-between gap-4 bg-[#D9F4E6] px-2 py-4 text-base md:p-[30px]">
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
          <button className="nav-button" onClick={walletDailog.toggle}>
            {t('connectWallet')}
          </button>
        )}

        <Menu onboardDialog={onboardDialog} />
      </nav>
      <WalletSelector dialog={walletDailog} />
    </header>
  );
};

export default Header;
