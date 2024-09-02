import { optimism, optimismSepolia } from "viem/chains";
import { Network, Subgraph, SUBGRAPHS } from "../../package/gql/codegen";
import { GraphQLClient } from "graphql-request";

export const networkIdEnumMap = {
  "10": Network.Optimism,
  "11155420":Network.OptimismSepolia
};

export function networkFor(key?: string | number) {
  if (!key) {
    return Network.OptimismSepolia;
  }
  return networkIdEnumMap[key.toString() as keyof typeof networkIdEnumMap];
}

const clientFor = (client: Subgraph) => (chainId: string) => {
  const network = networkFor(chainId);
  const endpoint = SUBGRAPHS[client].endpointFor(network);
  return new GraphQLClient(endpoint);
};

export const gqlApiEndpoints = {
  [optimism.id]: "https://optimism.easscan.org/graphql",
  [optimismSepolia.id]: "https://optimism-sepolia.easscan.org/graphql",
} as const;
