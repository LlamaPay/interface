import Head from 'next/head';
import React from 'react';
import Header from './Header';
import classNames from 'classnames';
import Footer from './Footer';

interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
  return (
    <>
      <Head>
        <title>LlamaPay</title>
        <meta
          name="description"
          content="LlamaPay is a multi-chain protocol that allows you to automate transactions and stream them by the second. The recipients can withdraw these funds at any time. This eliminates the need for manual transactions."
        />
      </Head>
      <Header />
      <main className={classNames('flex-1 p-2', className)} {...props}>
        {children}
      </main>
      <Footer />
    </>
  );
}
