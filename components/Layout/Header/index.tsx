import * as React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { NetworksMenu, Account, WalletSelector } from 'components/Web3';
import { Logo } from 'components/Icons';
import { DisclosureState } from 'ariakit';

const Header = ({ onBoardDialog }: { onBoardDialog: DisclosureState }) => {
  const [{ data }] = useAccount();
  const [openWalletSelector, setDisplaySelector] = React.useState(false);

  return (
    <header>
      <nav className="flex flex-wrap justify-between gap-6 bg-[#D9F4E6] px-2 py-4 text-base md:gap-10 md:p-[30px]">
        <Link href="/" passHref>
          <span className="flex-1">
            <Logo />
          </span>
        </Link>

        <div className="flex items-center justify-between gap-10">
          <a
            className="font-exo text-lg font-medium text-[#4F4F4F]"
            href="https://docs.llamapay.io/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Docs
          </a>
          <button className="font-exo text-lg font-medium text-[#4F4F4F]" onClick={onBoardDialog.toggle}>
            Get Started
          </button>
        </div>

        {data ? (
          <div className="flex w-full flex-wrap items-center justify-between gap-6 lg:w-[revert]">
            <NetworksMenu />
            <Account showAccountInfo={() => setDisplaySelector(!openWalletSelector)} />
          </div>
        ) : (
          <button className="nav-button" onClick={() => setDisplaySelector(!openWalletSelector)}>
            Connect Wallet
          </button>
        )}
      </nav>
      <WalletSelector isOpen={openWalletSelector} setIsOpen={setDisplaySelector} />
    </header>
  );
};

export default Header;
