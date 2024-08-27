import { useCreateEventAttestation } from "../hooks/useCreateEventAttestation";
import type {Event} from "../hooks/useCreateEventAttestation"

export function CreateEventAttestationButton() {
    const createEventAttestation = useCreateEventAttestation();

    async function handleCreateEventAttestation() {

        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate()+1);
        const newEvent = {
            owner:"0xa90914762709441d557De208bAcE1edB1A3968b2",
            name:"test",
            briefDescription:"test description",
            fullDescription:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, numquam! Esse officia molestiae illum nihil dolorum rem debitis laborum ab. Quaerat voluptatibus repellendus deserunt porro distinctio laboriosam earum nesciunt laborum?",
            startsAt: today.valueOf(),
            endsAt: tomorrow.valueOf(),
            imageUrl:"https://picsum.photos/id/237/200/300",
        } as Event
        console.log('newEvent', newEvent)

        createEventAttestation({event:newEvent})
            .then(response => {
                console.log('created event attestation');
                console.log('response: ', response)
            })
            .catch(error => {
                console.log('Error during attestation creation');
                console.log(error)
            })
    }

    return (
        <button 
            className="bg-white hover:bg-gray-300 text-gray-800 font-semibold mr-4 py-2 px-4 border border-gray-400 rounded-lg shadow"
            onClick={handleCreateEventAttestation}
            >
            Create Event Attestation
        </button>
    )
}