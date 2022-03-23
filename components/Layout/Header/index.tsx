import Link from 'next/link';
import * as React from 'react';
import { useAccount } from 'wagmi';
import { NetworksMenu, Account, WalletSelector } from '../../Web3';

const Header = () => {
  const [{ data }] = useAccount();
  const [openWalletSelector, setDisplaySelector] = React.useState(false);

  return (
    <>
      <header className="flex items-center justify-between p-2 text-base">
        <Link href="/" passHref>
          <a className="py-2">LlamaPay</a>
        </Link>
        <nav className="flex items-baseline space-x-2">
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
        </nav>
      </header>
      <WalletSelector isOpen={openWalletSelector} setIsOpen={setDisplaySelector} />
    </>
  );
};

export default Header;
