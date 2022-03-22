import Head from 'next/head';
import React from 'react';
import classNames from 'classnames';

interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
  return (
    <div className={classNames('flex min-h-screen flex-col slashed-zero', className)} {...props}>
      <Head>
        <title>LlamaPay</title>
        <meta
          name="description"
          content="LlamaPay is a multi-chain protocol that allows you to automate transactions and stream them by the second. The recipients can withdraw these funds at any time. This eliminates the need for manual transactions."
        />
      </Head>
      {children}
    </div>
  );
}
