import * as React from 'react';
import initSdk from '@gnosis.pm/safe-apps-sdk';

export const SafeContext = React.createContext<any>({});

type Props = {
  children: React.ReactNode;
};

function SafeContextProvider({ children }: Props) {
  const appsSdk = new initSdk();

  return <SafeContext.Provider value={appsSdk}>{children}</SafeContext.Provider>;
}

export default SafeContextProvider;
