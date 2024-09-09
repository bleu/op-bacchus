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


