"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { Provider } from "urql";
import { Client, fetchExchange } from "urql";
import { type State, WagmiProvider, useChainId } from "wagmi";

import { getConfig } from "@/wagmi";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

const client = new Client({
	url: 'https://optimism-sepolia.easscan.org/graphql"',
	exchanges: [fetchExchange],
});

export function Providers(props: {
	children: ReactNode;
	initialState?: State;
}) {
	const [config] = useState(() => getConfig());
	const [queryClient] = useState(() => new QueryClient());

	return (
		<WagmiProvider config={config} initialState={props.initialState}>
			<QueryClientProvider client={queryClient}>
				<Provider value={client}>
					<RainbowKitProvider>{props.children}</RainbowKitProvider>
				</Provider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
