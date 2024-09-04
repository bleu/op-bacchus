import { optimism, optimismSepolia } from "wagmi/chains";

export const NEXT_PUBLIC_API_URL_MAPPING: { [key: string]: string } = {
  [optimismSepolia.id]: "https://optimism-sepolia.easscan.org/graphql",
  [optimism.id]: "https://optimism.easscan.org/graphql",
};
