import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { mainnet, optimism, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected } from "wagmi/connectors";
// import {metaMask} from "wagmi/connectors"

const MetaMaskOptions = {
  dappMetadata: {
    name: "Bacchus",
  },
  infuraAPIKey: process.env.INFURA_API_KEY,
  // Other options.
}

export function getConfig() {
  return createConfig({
    chains: [optimism],
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
      // [mainnet.id]: http(),
      // [sepolia.id]: http(),
      [optimism.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
