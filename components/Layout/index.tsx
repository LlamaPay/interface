import * as React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDialogState } from 'ariakit';
import { useAccount } from 'wagmi';
import Header from './Header';
import Hero from './Hero';
import Footer from './Footer';
import OnboardDialog from '~/components/Onboard';
import CustomToast from '~/components/CustomToast';
import StaleSubgraphWarning from '~/components/StaleSubgraphWarning';
import HowItWorks from './HowItWorks';
import GnosisSafeWarning from '~/components/GnosisSafeWarning';
import { Nav } from './Nav';
import classNames from 'classnames';
import { useIsMounted } from '~/hooks';

interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
  const router = useRouter();
  const { isConnected } = useAccount();
  const onboardDialog = useDialogState();
  const walletDialog = useDialogState();
  const isMounted = useIsMounted();

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

      <Header onboardDialog={onboardDialog} walletDialog={walletDialog} />

      {isMounted ? (
        <>
          {router.pathname === '/' && !isConnected ? (
            <>
              <Hero walletDialog={walletDialog} />
              <HowItWorks onboardDialog={onboardDialog} />
            </>
          ) : (
            <div className="flex flex-1 py-9 px-2 md:px-6 lg:px-8 lg:pl-0">
              <Nav />
              <main className={classNames('mx-auto max-w-7xl flex-1', className)} {...props}>
                {children}
              </main>
            </div>
          )}
        </>
      ) : (
        <div className="flex-1 lg:min-h-[425px]"></div>
      )}

      <OnboardDialog dialog={onboardDialog} />

      <Footer />

      <CustomToast />

      <GnosisSafeWarning />
    </>
  );
}
