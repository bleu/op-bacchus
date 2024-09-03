import { gql } from "graphql-tag";

export const veBalGetVotingList = gql`
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
  }
}
`;