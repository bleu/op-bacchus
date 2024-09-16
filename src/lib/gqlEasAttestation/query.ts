import { graphql } from "gql.tada";

export const EVENTS_ATTESTATIONS_QUERY = graphql(`
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

export const USER_ATTESTATIONS_QUERY = graphql(`
  query getEventAttestationsByAttester($schemaId: String!, $attester: String!) {
    attestations(where: {
      AND: [
        { schemaId: { equals: $schemaId } },
        { attester: { equals: $attester } }
      ]
    }) {
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

export const GET_ATTESTATION_BY_ID_QUERY = graphql(`
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
