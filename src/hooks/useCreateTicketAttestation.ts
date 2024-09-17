import {
	CREATE_TICKET_SCHEMA,
	CREATE_TICKET_SCHEMA_UID,
} from "@/components/CreateTicketSchemaButton";
import { useSigner } from "@/hooks/useSigner";
import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { useCallback, useEffect, useState } from "react";
import { zeroAddress } from "viem";
import type { Address } from "viem";

export interface Ticket {
	owner: Address;
	eventid: string;
}

export const CREATE_TICKET_SCHEMA_ENCODER = new SchemaEncoder(
	CREATE_TICKET_SCHEMA,
);

export const useCreateTicketAttestation = () => {
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

	const createTicketAttestation = useCallback(
		async ({ ticket }: { ticket: Ticket }) => {
			if (!eas) throw new Error("EAS not initialized");
			const encodedData = CREATE_TICKET_SCHEMA_ENCODER.encodeData([
				{
					name: "owner",
					value: encodeURIComponent(ticket.owner),
					type: "address",
				},
				{
					name: "eventid",
					value: encodeURIComponent(ticket.name),
					type: "string",
				},
			]);
			const tx = await eas.attest({
				schema: CREATE_TICKET_SCHEMA_UID,
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

	return createTicketAttestation;
};
