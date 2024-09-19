import { optimism, optimismSepolia } from "wagmi/chains";

export const API_URL_MAPPING: { [key: string]: string } = {
  [optimismSepolia.id]: "https://optimism-sepolia.easscan.org/graphql",
  [optimism.id]: "https://optimism.easscan.org/graphql",
} as const;

export const EVENT_SCHEMA_ID =
  "0x9df632ca2cb76ab5cd81a3b3b55abfba449b2623d0c385051e3b427fa0de1829";
