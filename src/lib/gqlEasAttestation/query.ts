import { gql } from "urql";

export const EVENTS_ATTESTATIONS_QUERY = gql(`
  query getAttestationsEvents($schemaId: String!) {
    attestations(
      where: { schemaId: {equals: $schemaId} }
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
    }
  }
`);

export const USER_ATTESTATIONS_QUERY = gql(`
  query getAttestationsByAttester($attester: String!, $schemaId: String!) {
    attestations(where: { attester: { equals: $attester }, schemaId: { equals: $schemaId } }) {
      id
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
      decodedDataJson
    }
  }
`);

export const GET_ATTESTATION_BY_ID_QUERY = gql(`
  query Attestation($id: String!) {
    attestation(where: { id: $id }) {
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

export const GET_TICKETS_BY_EVENT_QUERY = gql(`
  query getTicketsByEvent($schemaId: String!, $eventId: String!) {
    attestations(
      where: { schemaId: { equals: $schemaId }, refUID: { equals: $eventId } }
    ) {
      id
      attester
      decodedDataJson
      recipient
      refUID
      revoked
    }
  }
`);

export const TICKET_BY_RECIPIENT_QUERY = gql(`
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
