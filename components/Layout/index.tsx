import * as React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useDialogState } from 'ariakit';
import classNames from 'classnames';
import Header from './Header';
import Hero from 'components/Hero';
import OnboardDialog from 'components/Onboard';
import CustomToast from 'components/CustomToast';
import StaleSubgraphWarning from 'components/StaleSubgraphWarning';

interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
  noBanner?: boolean;
}

const Footer = dynamic(() => import('./Footer'), {
  ssr: false,
});

export default function Layout({ children, className, noBanner = false, ...props }: ILayoutProps) {
  const router = useRouter();

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

      {router.pathname === '/' && <Hero noBanner={noBanner} onboardDialog={onboardDialog} />}

      <main className={classNames('flex-1', className)} {...props}>
        {children}
      </main>

      <OnboardDialog dialog={onboardDialog} />
      <Footer />
      <CustomToast />
    </>
  );
}
