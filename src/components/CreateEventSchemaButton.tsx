import { useRegistrySchema } from "@/hooks/useRegistrySchema";
import { zeroAddress } from "viem";
import styled from "styled-components"

const Button = styled.button`
    padding: 0.5rem 1rem;
    background-color: gray;
    margin-right:1rem;
    border-radius:10px;

    &:hover {
        background-color: #4a4a4a;
    }
`

// const today = new Date();
// const tomorrow = new Date();
// tomorrow.setDate(today.getDate()+1);
// const newEvent = {
//     owner:"0xa90914762709441d557De208bAcE1edB1A3968b2",
//     name:"test",
//     briefDescription:"test description",
//     fullDescription:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, numquam! Esse officia molestiae illum nihil dolorum rem debitis laborum ab. Quaerat voluptatibus repellendus deserunt porro distinctio laboriosam earum nesciunt laborum?",
//     startsAt: today.valueOf(),
//     endsAt: tomorrow.valueOf(),
//     imageUrl:"https://picsum.photos/id/237/200/300",
// } as EventSchema
// console.log('newEvent', newEvent)

const CREATE_EVENT_SCHEMA =
    "string name, string briefDescription, string fullDescription, uint256 startsAt, uint256 endsAt, string imageUrl"

export function CreateEventSchemaButton() {
    const registrySchema = useRegistrySchema();

    async function handleCreateEventSchema() {

        registrySchema({
            schema:CREATE_EVENT_SCHEMA,
            resolver:zeroAddress,
            revocable:true,
        })
    }

    return (
        <Button onClick={handleCreateEventSchema}>
            Create Event Schema
        </Button>
    )
}