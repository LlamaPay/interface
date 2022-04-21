import * as React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { NetworksMenu, Account, WalletSelector } from 'components/Web3';
import LogoDark from 'public/logo-dark.svg';
import Image from 'next/image';

const Header = () => {
  const [{ data }] = useAccount();
  const [openWalletSelector, setDisplaySelector] = React.useState(false);

  return (
    <header>
      <nav className="flex flex-col justify-between gap-4 bg-[#D9F4E6] p-2 text-base md:flex-row md:gap-10 md:p-[30px]">
        <div className="flex flex-1 items-center justify-between">
          <Link href="/" passHref>
            <div className="flex flex-shrink-0 cursor-pointer">
              <Image src={LogoDark} width="124px" height="40px" alt="LlamaPay logo" />
            </div>
          </Link>

          <a
            className="font-exo text-lg font-medium text-[#4F4F4F]"
            href="https://docs.llamapay.io/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Docs
          </a>
        </div>

        {data ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
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
