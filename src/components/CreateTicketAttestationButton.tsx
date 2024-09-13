import { useCreateTicketAttestation } from "../hooks/useCreateTicketAttestation";
import type { Ticket } from "../hooks/useCreateTicketAttestation";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { useQuery } from 'urql';



const ATTESTATION_QUERY = `
  query GetLatestAttestation($address: String!) {
    attestations(
      where: { attester: { equals: $address } }
      orderBy: { timeCreated: desc }
      take: 1
    ) {
      id
      attester
      timeCreated
    }
  }
`;


export function CreateTicketAttestationButton() {
	const createTicketAttestation = useCreateTicketAttestation();
  const { address } = useAccount();


  const [result] = useQuery({
    query: ATTESTATION_QUERY,
    variables: { address },
    pause: !address,
  });

  const newTicket = {
    owner: address || '',
    eventid: result.data?.attestations[0]?.id,
  } as Ticket;



	async function handleCreateTicketAttestation() {
		await createTicketAttestation({ ticket: newTicket }).catch((error) => {
			toast(error, {
				position: "top-center",
				type: "warning",
				autoClose: 3000,
				theme: "light",
				pauseOnHover: true,
			});
		});
	}

	return (
		<button
			className="bg-white hover:bg-gray-300 text-gray-800 font-semibold mr-4 py-2 px-4 border border-gray-400 rounded-lg shadow"
			onClick={handleCreateTicketAttestation}
		>
			Create Ticket Attestation
		</button>
	);
}
