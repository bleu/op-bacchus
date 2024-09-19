import { gql } from 'urql';

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
  query getAttestationsByAttester($attester: String!) {
    attestations(where: {
      AND: [
        { schemaId: { equals: $schemaId } },
        { attester: { equals: $attester } }
      ]
    }) 
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
