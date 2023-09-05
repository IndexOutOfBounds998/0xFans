import '@styles/globals.scss';

import { AuthContextProvider } from '@lib/context/auth-context';
import { ThemeContextProvider } from '@lib/context/theme-context';
import { AppHead } from '@components/common/app-head';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import {
  LensProvider,
  LensConfig,
  production,
  appId,
  development
} from '@lens-protocol/react-web';
import { bindings } from '@lens-protocol/wagmi';

import React, { useEffect } from 'react';
import { ALCHEMY_KEY, RB_PID, MAIN_NETWORK, APP_ID } from '@lib/const';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { polygonMumbai, polygon } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { I18nProvider } from "@lingui/react";
import { useLinguiInit } from 'translations/utils';
const { chains, publicClient } = configureChains(
  [MAIN_NETWORK ? polygon : polygonMumbai],
  [alchemyProvider({ apiKey: ALCHEMY_KEY }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: APP_ID,
  projectId: RB_PID,
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});


const lensConfig: LensConfig = {
  bindings: bindings(),
  environment: MAIN_NETWORK ? production : development,
  sources: [
    appId(APP_ID)
  ],
  appId: appId(APP_ID),
};

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({
  Component,
  pageProps
}: AppPropsWithLayout): ReactNode {
  const getLayout = Component.getLayout ?? ((page): ReactNode => page);
  const initializedI18n = useLinguiInit(pageProps.i18n);
  return (
    <>
      <I18nProvider i18n={initializedI18n}>
        <AppHead />
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains} coolMode={true}>
            <LensProvider config={lensConfig}>
              <AuthContextProvider>
                <ThemeContextProvider>
                  {getLayout(<Component {...pageProps} />)}
                  <Analytics />
                </ThemeContextProvider>
              </AuthContextProvider>
            </LensProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </I18nProvider>
    </>
  );
}
