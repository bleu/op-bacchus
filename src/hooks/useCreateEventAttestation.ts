import { useSigner } from "@/hooks/useSigner";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useCallback, useEffect, useState } from "react";
import { encodePacked, keccak256, zeroAddress } from "viem";
import type { Address } from "viem";

export const CREATE_EVENT_SCHEMA =
  "address owner, string name, string briefDescription, string fullDescription, string type, uint256 startsAt, uint256 endsAt, string imageUrl, string access";

export const CREATE_EVENT_SCHEMA_UID = keccak256(
  encodePacked(
    ["string", "address", "bool"],
    [CREATE_EVENT_SCHEMA, zeroAddress, true],
  ),
);

export interface Event {
  owner: Address;
  name: string;
  briefDescription: string;
  fullDescription: string;
  startsAt: number;
  endsAt: number;
  imageUrl: string;
  type: "online" | "inPerson";
  access: string;
}

export const CREATE_EVENT_SCHEMA_ENCODER = new SchemaEncoder(
  CREATE_EVENT_SCHEMA,
);

export const useCreateEventAttestation = () => {
  const EAS_CONTRACT_ADDRESS = "0x4200000000000000000000000000000000000021";

  const signer = useSigner();
  const [eas, setEas] = useState<EAS | null>(null);

  useEffect(() => {
    if (signer) {
      const newEas = new EAS(EAS_CONTRACT_ADDRESS);
      newEas.connect(signer);
      setEas(newEas);
    }
  }, [signer]);

  const createEventAttestation = useCallback(
    async ({ event }: { event: Event }) => {
      if (!eas) throw new Error("EAS not initialized");
      const encodedData = CREATE_EVENT_SCHEMA_ENCODER.encodeData([
        {
          name: "owner",
          value: encodeURIComponent(event.owner),
          type: "address",
        },
        {
          name: "name",
          value: encodeURIComponent(event.name),
          type: "string",
        },
        {
          name: "briefDescription",
          value: encodeURIComponent(event.briefDescription),
          type: "string",
        },
        {
          name: "fullDescription",
          value: encodeURIComponent(event.fullDescription),
          type: "string",
        },
        {
          name: "type",
          value: encodeURIComponent(event.type),
          type: "string",
        },
        {
          name: "startsAt",
          value: encodeURIComponent(event.startsAt),
          type: "uint256",
        },
        {
          name: "endsAt",
          value: encodeURIComponent(event.endsAt),
          type: "uint256",
        },
        {
          name: "imageUrl",
          value: encodeURIComponent(event.imageUrl),
          type: "string",
        },
        {
          name: "access",
          value: encodeURIComponent(event.access),
          type: "string",
        },
      ]);
      const tx = await eas.attest({
        schema: CREATE_EVENT_SCHEMA_UID,
        data: {
          recipient: zeroAddress,
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
        },
      });

      return await tx.wait();
    },
    [eas],
  );

  return createEventAttestation;
};
