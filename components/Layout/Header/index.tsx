import * as React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { NetworksMenu, Account, WalletSelector } from 'components/Web3';

const Header = () => {
  const [{ data }] = useAccount();
  const [openWalletSelector, setDisplaySelector] = React.useState(false);

  // TODO fix mobile layout
  return (
    <header>
      <nav className="flex flex-col items-baseline justify-end space-y-2 p-2 text-base sm:flex-row">
        <Link href="/" passHref>
          <a className="py-2">LlamaPay</a>
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
