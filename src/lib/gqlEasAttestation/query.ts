import { graphql } from "gql.tada";

export const USER_ATTESTATIONS_QUERY = graphql(`
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
    }
  }
`);
