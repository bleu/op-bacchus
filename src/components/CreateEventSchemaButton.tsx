import { useRegistrySchema } from "@/hooks/useRegistrySchema";
import { zeroAddress } from "viem";

const CREATE_EVENT_SCHEMA =
	"string name, string briefDescription, string fullDescription, uint256 startsAt, uint256 endsAt, string imageUrl";

export function CreateEventSchemaButton() {
	const registrySchema = useRegistrySchema();

	async function handleCreateEventSchema() {
		registrySchema({
			schema: CREATE_EVENT_SCHEMA,
			resolver: zeroAddress,
			revocable: true,
		});
	}

	return (
		<button
			className="bg-white hover:bg-gray-300 text-gray-800 font-semibold mr-4 py-2 px-2 text-sm border border-gray-400 rounded-lg shadow"
			onClick={handleCreateEventSchema}
		>
			Create Event Schema
		</button>
	);
}
