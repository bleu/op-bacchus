import { gql } from 'urql';

export const USER_ATTESTATIONS_QUERY = gql(`
  query getAttestationsByAttester($attester: String!) {
    attestations(where: { attester: { equals: $attester } }) {
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
