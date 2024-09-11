import { useCreateTicketAttestation } from "../hooks/useCreateTicketAttestation";
import type { Ticket } from "../hooks/useCreateTicketAttestation";
import { toast } from "react-toastify";



const newTicket = {
  owner: "0xa90914762709441d557De208bAcE1edB1A3968b2",
  eventid: "test",
} as Ticket;

export function CreateTicketAttestationButton() {
  const createTicketAttestation = useCreateTicketAttestation();

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
