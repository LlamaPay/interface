import * as React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { NetworksMenu, Account, WalletSelector } from 'components/Web3';
import LogoDark from 'public/logo-dark.svg';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const Header = () => {
  const [{ data }] = useAccount();
  const [openWalletSelector, setDisplaySelector] = React.useState(false);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <header>
      <nav className="flex flex-col items-center justify-end space-y-2 bg-[#D9F4E6] p-2 text-base sm:flex-row sm:space-y-0 md:p-[30px]">
        <Link href="/" passHref>
          <div className="flex cursor-pointer">
            <Image src={LogoDark} width="124px" height="40px" alt="LlamaPay logo" />
          </div>
        </Link>

        <div className="mx-auto flex flex-1 flex-wrap items-baseline justify-end gap-2">
          <a
            className="mx-8 text-lg font-medium text-[#4F4F4F]"
            href="https://docs.llamapay.io/"
            target="_blank"
            rel="noreferrer noopener"
          >
            Docs
          </a>
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
        </div>
      </nav>
      <WalletSelector isOpen={openWalletSelector} setIsOpen={setDisplaySelector} />
    </header>
  );
};

export default Header;
