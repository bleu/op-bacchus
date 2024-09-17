import { graphql } from "gql.tada";

export const USER_ATTESTATIONS_QUERY = graphql(`
query getAttestationsByAttester($attester: String!) {
  attestations(
    where: { attester: {equals: $attester} }
  ) {
    id 
    attester
    recipient
    refUID
    revocable
    revocationTime
    expirationTime
    data
    decodedDataJson
    timeCreated
  }
}
`);

export const TICKET_BY_EVENTS_QUERY = graphql(`
query getTicketsByEvent($schemaId: String!, $eventId: String!) {
  attestations(
    where: { schemaId: {equals:$schemaId}, refUID: {equals: $eventId}}
  ) {
    id
    attester
    decodedDataJson
    recipient
    refUID
  }
}
    `);

export const TICKET_BY_RECIPIENT_QUERY = graphql(`
query getTicketsByRecipient($schemaId: String!, $recipient: String!) {
  attestations(
    where: { schemaId: {equals:$schemaId}, recipient: {equals: $recipient}}
  ) {
    id
    attester
    decodedDataJson
    recipient
    refUID
  }
}
  `);

export const TICKETS_BY_RECIPIENT = graphql(`
  query getAttestationsByRecipient($recipient: String!) {
    attestations(
      where: { recipient: {equals: $recipient},
               data: { not: { equals: "" } } }
    ) {
      id 
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
      decodedDataJson
      timeCreated
    }
  }
  `);


  export const GET_ATTESTATION_BY_ID_QUERY = graphql(`
  query GetAttestationsByIDs($ids: [String!]!) {
    attestations(where: { id: { in: $ids } }) {
      id
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
      decodedDataJson
      timeCreated
    }
  }
  `);
  
  
  

  


