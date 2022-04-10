import Head from 'next/head';
import * as React from 'react';
import Header from './Header';
import classNames from 'classnames';
import Footer from './Footer';
import { useAccount } from 'wagmi';
import { useNetworkProvider } from 'hooks';
import { Toaster } from 'react-hot-toast';

interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
  const [{ data: accountData }] = useAccount();

  const { unsupported } = useNetworkProvider();

  return (
    <>
      <Head>
        <title>LlamaPay</title>
        <meta
          name="description"
          content="LlamaPay is a multi-chain protocol that allows you to automate transactions and stream them by the second. The recipients can withdraw these funds at any time. This eliminates the need for manual transactions."
        />
      </Head>
      <Toaster />
      <Header />
      <main className={classNames('flex-1 p-2', className)} {...props}>
        {!accountData ? (
          <p className="mx-auto mt-8 text-red-500">Connect wallet to continue</p>
        ) : unsupported ? (
          <p className="mx-auto mt-8 text-red-500">Chain not supported</p>
        ) : (
          <>{children}</>
        )}
      </main>
      <Footer />
    </>
  );
}
