import * as React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { NetworksMenu, Account, WalletSelector } from 'components/Web3';
import LogoLight from 'public/logo-light.svg';
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
      <nav className="flex flex-col items-center justify-end space-y-2 p-2 text-base sm:flex-row sm:space-y-0">
        <Link href="/" passHref>
          <div className="flex h-10 cursor-pointer">
            <Image src={isDark ? LogoLight : LogoDark} width="140px" height="40px" alt="LlamaPay logo" />
          </div>
        </Link>

        <div className="mx-auto flex flex-1 flex-wrap items-baseline justify-end gap-2">
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
