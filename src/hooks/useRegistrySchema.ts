import { useSigner } from "@/hooks/useSigner";
import { zeroAddress } from "viem";
import { EAS, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { useCallback, useEffect, useState } from "react";
import type { Address } from "viem";
import { CREATE_EVENT_SCHEMA_UID } from "@/components/CreateEventSchemaButton";

interface RegistrySchemaParms {
  schema: string;
  resolver: Address;
  revocable: boolean;
}

export const useRegistrySchema = () => {
  // Addresses only valid for Optimism Sepolia
  const EAS_CONTRACT_ADDRESS = "0x4200000000000000000000000000000000000021";
  const SCHEMA_REGISTRY_CONTRACT_ADDRESS =
    "0x4200000000000000000000000000000000000020";

  const [schemaRegistry, setSchemaRegistry] = useState<SchemaRegistry | null>(
    null
  );
  const [eas, setEas] = useState<EAS | null>(null);
  const signer = useSigner();

  useEffect(() => {
    if (signer) {
      const newEas = new EAS(EAS_CONTRACT_ADDRESS);
      newEas.connect(signer);

      const newSchemaRegistry = new SchemaRegistry(
        SCHEMA_REGISTRY_CONTRACT_ADDRESS
      );
      newSchemaRegistry.connect(signer);
      setSchemaRegistry(newSchemaRegistry);
    }
  }, [signer]);

  const registrySchema = useCallback(
    async ({ schema, resolver, revocable }: RegistrySchemaParms) => {
      console.log(`
            ---Called registrySchema. Create Schema:
            schema: ${schema}
            resolver: ${resolver}
            revocable: ${revocable}
            ---

            `);

      console.log("Schema UID:", CREATE_EVENT_SCHEMA_UID);

      const isAbleToOperateSchema = signer && schemaRegistry;
      console.log("isAbleToOperateSchema", isAbleToOperateSchema);

      if (isAbleToOperateSchema) {
        try {
          await schemaRegistry.getSchema({ uid: CREATE_EVENT_SCHEMA_UID });
          console.log("No errors getting schema");
        } catch (e) {
          // If schemas don't exist, create them
          console.log("No existing schema, creating a new one...");
          const selfAttestationTx = await schemaRegistry
            .connect(signer)
            .register({
              schema: schema,
              resolverAddress: zeroAddress,
              revocable: true,
            });
          await selfAttestationTx.wait();
          console.log("Schema should have been created!");
        }
      } else {
        console.log("Not possible to create schema");
        console.log("signer", signer);
        console.log("schemaRegistry", schemaRegistry);
      }
    },
    [signer, schemaRegistry]
  );

  return registrySchema;
};
