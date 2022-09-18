import * as React from 'react';
import Head from 'next/head';
import { useDialogState } from 'ariakit';
import classNames from 'classnames';
import Header from './Header';
import Footer from './Footer';
import OnboardDialog from 'components/Onboard';
import CustomToast from 'components/CustomToast';
import StaleSubgraphWarning from 'components/StaleSubgraphWarning';

interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
  noBanner?: boolean;
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
  const onboardDialog = useDialogState();

  return (
    <>
      <Head>
        <title>LlamaPay</title>
        <meta
          name="description"
          content="LlamaPay is a multi-chain protocol that allows you to automate transactions and stream them by the second. The recipients can withdraw these funds at any time. This eliminates the need for manual transactions."
        />
      </Head>
      <StaleSubgraphWarning />
      <Header onboardDialog={onboardDialog} />

      <main className={classNames('flex-1', className)} {...props}>
        {children}
      </main>

      <OnboardDialog dialog={onboardDialog} />

      <React.Suspense
        fallback={
          <footer className="mt-20 bg-lp-gray-5 p-[30px] md:px-[30px] lg:min-h-[420px] lg:p-[60px] xl:min-h-[480px] xl:p-[120px]" />
        }
      >
        <Footer />
      </React.Suspense>
      <CustomToast />
    </>
  );
}
