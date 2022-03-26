import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { NetworksMenu, Account, WalletSelector } from 'components/Web3';
import classNames from 'classnames';

const Header = () => {
  const [{ data }] = useAccount();
  const [openWalletSelector, setDisplaySelector] = React.useState(false);
  const router = useRouter();

  return (
    <header>
      <nav className="flex flex-1 items-baseline justify-end space-x-2 p-2 text-base">
        <Link href="/" passHref>
          <a className="flex-1 py-2">LlamaPay</a>
        </Link>
        <div className="flex flex-1 justify-center">
          <div className="flex items-baseline space-x-2 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
            <Link href="/" passHref>
              <button
                className={classNames(
                  'rounded-lg px-2 py-1',
                  router.pathname === '/' && 'bg-zinc-200 dark:bg-zinc-700'
                )}
              >
                Dashboard
              </button>
            </Link>
            <Link href="/create" passHref>
              <button
                className={classNames(
                  'rounded-lg px-2 py-1',
                  router.pathname === '/create' && 'bg-zinc-200 dark:bg-zinc-700'
                )}
              >
                New Stream
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-1 items-baseline justify-end space-x-2">
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
