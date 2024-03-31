import * as React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDialogState } from 'ariakit';
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
  children?: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
  const router = useRouter();
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

      <>
        {router.pathname === '/' ? (
          <>
            <Hero />
            <HowItWorks onboardDialog={onboardDialog} />
          </>
        ) : (
          <div className="flex flex-1 py-9 px-2 md:px-6 lg:px-8 lg:pl-0">
            <Nav />
            <main
              className={classNames(
                'mx-auto flex-1',
                router.pathname.includes('/create') || router.pathname.includes('/withdraw')
                  ? 'max-w-7xl lg:-ml-[72px]'
                  : '',
                className
              )}
              {...props}
            >
              {isMounted ? children : null}
            </main>
          </div>
        )}
      </>

      <OnboardDialog dialog={onboardDialog} />

      <Footer />

      <CustomToast />

      <GnosisSafeWarning />
    </>
  );
}
