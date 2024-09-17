import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { optimism, optimismSepolia } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";

export function getConfig() {
	return createConfig({
		chains: [optimism, optimismSepolia],
		connectors: [
			injected(),
			coinbaseWallet(),
			// walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID }),
		],
		storage: createStorage({
			storage: cookieStorage,
		}),
		ssr: true,
		transports: {
			[optimism.id]: http(),
			[optimismSepolia.id]: http(),
		},
	});
	return createConfig({
		chains: [optimismSepolia],
		connectors: [
			injected(),
			coinbaseWallet(),
			// walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID }),
		],
		storage: createStorage({
			storage: cookieStorage,
		}),
		ssr: true,
		transports: {
			// [optimism.id]: http(),
			[optimismSepolia.id]: http(),
		},
	});
}

declare module "wagmi" {
	interface Register {
		config: ReturnType<typeof getConfig>;
	}
}
