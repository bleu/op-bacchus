import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://optimism-sepolia.easscan.org/graphql",
  documents: "src/**/*.(ts|tsx)",
  generates: {
    "src/lib/gqlEasAttestation/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
    },
  },
};

export default config;
