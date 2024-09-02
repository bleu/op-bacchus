"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";

import { getConfig } from "@/wagmi";
import { Provider } from "urql";
import { client } from "../lib/urql-client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

export function Providers(props: {
	children: ReactNode;
	initialState?: State;
}) {
	const [config] = useState(() => getConfig());
	const [queryClient] = useState(() => new QueryClient());

	return (
		<WagmiProvider config={config} initialState={props.initialState}>
			<Provider value={client}>
				<QueryClientProvider client={queryClient}>
					<RainbowKitProvider>{props.children}</RainbowKitProvider>
				</QueryClientProvider>
			</Provider>
		</WagmiProvider>
	);
}
