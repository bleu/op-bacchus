import { useSigner } from "@/hooks/useSigner";
import { encodePacked, keccak256, zeroAddress } from "viem";
import { EAS, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { useCallback, useEffect, useState } from "react";

interface RegistrySchemaParms {
    schema: string,
    resolver:`0x${string}`,
    revocable:boolean,
};

export const useRegistrySchema = () => {

    // Optimism Sepolia Version 1.0.2
    const EAS_CONTRACT_ADDRESS = "0x4200000000000000000000000000000000000021" //Deployment and ABI: EAS.json
    const SCHEMA_REGISTRY_CONTRACT_ADDRESS = "0x4200000000000000000000000000000000000020" //Deployment and ABI: SchemaRegistry.json

    const [schemaRegistry, setSchemaRegistry] = useState<SchemaRegistry | null>(null);
    const [eas, setEas] = useState<EAS | null>(null);
    const signer = useSigner();
    
    useEffect(() => {
        if (signer) {
        const newEas = new EAS(EAS_CONTRACT_ADDRESS);
        newEas.connect(signer);
        setEas(newEas);
    
        const newSchemaRegistry = new SchemaRegistry(SCHEMA_REGISTRY_CONTRACT_ADDRESS);
        newSchemaRegistry.connect(signer);
        setSchemaRegistry(newSchemaRegistry);
        }
    }, [signer]);

    const registrySchema = useCallback(async ({schema, resolver, revocable}:RegistrySchemaParms) => {
            console.log(`
            ---Called registrySchema. Create Schema:
            schema: ${schema}
            resolver: ${resolver}
            revocable: ${revocable}
            ---

            `)

            const SCHEMA_UID = keccak256(
                encodePacked(
                    ["string", "address", "bool"],
                    [schema, resolver, revocable],
                ),
            );
            console.log('Schema UID:',SCHEMA_UID)

            const isAbleToOperateSchema = (signer && schemaRegistry)
            console.log('isAbleToOperateSchema',isAbleToOperateSchema);

            if (isAbleToOperateSchema) {
                try {
                    await schemaRegistry.getSchema({ uid: SCHEMA_UID });
                    console.log('No errors getting schema');
                } catch (e) {
                // If schemas don't exist, create them
                console.log('No existing schema, creating a new one...');
                const selfAttestationTx = await schemaRegistry.connect(signer).register({
                    schema: schema,
                    resolverAddress: zeroAddress,
                    revocable: true,
                });
                await selfAttestationTx.wait();
                console.log('Schema should have been created!');
                }
            } else {
                console.log('Not possible to create schema');
                console.log('signer',signer)
                console.log('schemaRegistry',schemaRegistry)
            }
        }
    ,[signer,schemaRegistry]);

    return registrySchema;
}