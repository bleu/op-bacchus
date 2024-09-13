import { useRegistrySchema } from "@/hooks/useRegistrySchema";
import { encodePacked, keccak256, zeroAddress } from "viem";

export const CREATE_TICKET_SCHEMA =
  "address owner, string eventid";

  export const CREATE_TICKET_SCHEMA_UID = keccak256(
    encodePacked(
      ["string", "address", "bool"],
      [CREATE_TICKET_SCHEMA, zeroAddress, true]
    )
  );
    
  export function CreateTicketSchemaButton() {
    const registrySchema = useRegistrySchema();


  async function handleCreateTicketSchema() {
    registrySchema({
      schema: CREATE_TICKET_SCHEMA,
      resolver: zeroAddress,
      revocable: true,
    });
  }

  return (
    <button className="bg-white hover:bg-gray-300 text-gray-800 font-semibold mr-4 py-2 px-2 text-sm border border-gray-400 rounded-lg shadow" 
    onClick={handleCreateTicketSchema}>
      Create Ticket Schema
    </button>
  );
}
