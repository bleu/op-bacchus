import { useSigner } from "@/hooks/useSigner";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useCallback, useEffect, useState } from "react";
import { encodePacked, keccak256, zeroAddress } from "viem";
import type { Address } from "viem";

const CREATE_TICKET_SCHEMA = "address owner, string eventId";

export const CREATE_TICKET_SCHEMA_UID = keccak256(
  encodePacked(
    ["string", "address", "bool"],
    [CREATE_TICKET_SCHEMA, zeroAddress, true],
  ),
);

export interface Ticket {
  owner: Address;
  eventId: string;
}

export const CREATE_TICKET_SCHEMA_ENCODER = new SchemaEncoder(
  CREATE_TICKET_SCHEMA,
);

export const useCreateTicketMultiAttestations = () => {
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

  const createTicketMultiAttestations = useCallback(
    async ({ tickets }: { tickets: Ticket[] }) => {
      if (!eas) throw new Error("EAS not initialized");

      const multiEncodedData = tickets.map((ticket) => {
        return CREATE_TICKET_SCHEMA_ENCODER.encodeData([
          {
            name: "owner",
            value: encodeURIComponent(ticket.owner),
            type: "address",
          },
          {
            name: "eventId",
            value: encodeURIComponent(ticket.eventId),
            type: "string",
          },
        ]);
      });

      const multiData = multiEncodedData.map((encodedData, index) => {
        return {
          recipient: tickets[index].owner,
          expirationTime: BigInt(0),
          revocable: true,
          data: encodedData,
          refUID: tickets[index].eventId,
        };
      });

      const tx = await eas.multiAttest([
        {
          schema: CREATE_TICKET_SCHEMA_UID,
          data: multiData,
        },
      ]);

      return await tx.wait();
    },
    [eas],
  );

  return createTicketMultiAttestations;
};
