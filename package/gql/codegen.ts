import { CodegenConfig } from "@graphql-codegen/cli";

function capitalize(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

export enum Network {
    Optimism = "optimism",
    OptimismSepolia = "optimism-sepolia",
  }

export enum Subgraph {
  EasAttestations = "eas",
}

export const SUBGRAPHS = {
  [Subgraph.EasAttestations]: {
    name: Subgraph.EasAttestations,
    endpoints() { 

      return {
        [Network.Optimism]: "https://optimism.easscan.org/graphql",
        [Network.OptimismSepolia]: "https://optimism-sepolia.easscan.org/graphql",
      };
    },
    endpointFor(network: Network) {
      return this.endpoints()[network];
    },
  },
};

const generates = Object.assign(
  {},
  ...Object.values(SUBGRAPHS).map(({ name, endpoints }) =>
    Object.fromEntries(
      Object.entries(endpoints())
        .map(([network, endpoint]) => [
          [
            `./src/${name}/__generated__/${capitalize(network)}.ts`,
            {
              schema: endpoint,
              documents: [`src/${name}/*.ts`],
              plugins: [
                "typescript",
                "typescript-operations",
                "typescript-graphql-request",
                "plugin-typescript-swr",
              ],
            },
          ],
          [
            `./src/${name}/__generated__/${capitalize(network)}.server.ts`,
            {
              schema: endpoint,
              documents: [`src/${name}/*.ts`],
              plugins: [
                "typescript",
                "typescript-operations",
                "typescript-graphql-request",
              ],
            },
          ],
        ])
        .flat(1),
    ),
  ),
);

const config: CodegenConfig = {
  config: {
    autogenSWRKey: true,
    enumsAsTypes: true,
    futureProofEnums: true,
  },
  generates,
};

export default config;