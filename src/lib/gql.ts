import { optimism, optimismSepolia } from "viem/chains";

export const gqlApiEndpoints = {
  [optimism.id]: "https://optimism.easscan.org/graphql",
  [optimismSepolia.id]: "https://optimism-sepolia-bedrock.easscan.org/graphql",
} as const;
