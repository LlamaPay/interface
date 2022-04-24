import * as React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { NetworksMenu, Account, WalletSelector } from 'components/Web3';
import { Logo } from 'components/Icons';
import { DisclosureState } from 'ariakit';
import Menu from './Menu';

const Header = ({ onboardDialog }: { onboardDialog: DisclosureState }) => {
  const [{ data }] = useAccount();
  const [openWalletSelector, setDisplaySelector] = React.useState(false);

  return (
    <header className="flex items-center justify-between gap-4 overflow-x-auto bg-[#D9F4E6] px-2 py-4 text-base md:p-[30px]">
      <Link href="/" passHref>
        <a className="flex-1">
          <Logo />
        </a>
      </Link>

      <nav className="flex flex-shrink-0 justify-between gap-[0.625rem] bg-[#D9F4E6] text-base">
        {data ? (
          <>
            <NetworksMenu />
            <Account showAccountInfo={() => setDisplaySelector(!openWalletSelector)} />
          </>
        ) : (
          <button className="nav-button" onClick={() => setDisplaySelector(!openWalletSelector)}>
            Connect Wallet
          </button>
        )}

        <Menu onboardDialog={onboardDialog} className="" />
      </nav>
      <WalletSelector isOpen={openWalletSelector} setIsOpen={setDisplaySelector} />
    </header>
  );
};

export default Header;
