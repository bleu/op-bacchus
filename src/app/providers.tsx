"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";

import { getConfig } from "@/wagmi";
import { Provider } from "urql";
import { client } from "../lib/urql-client";

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  type Locale,
} from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  // const {locale} = useRouter() as {locale:Locale}
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <Provider value={client}>
          <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {props.children}
            </RainbowKitProvider>
          </QueryClientProvider>
      </Provider>
    </WagmiProvider>
  );
}
