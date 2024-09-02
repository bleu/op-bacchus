import { GraphQLClient } from "graphql-request";
import { getSdk } from "./generated";


export const ENDPOINT = "https://optimism-sepolia.easscan.org/graphql";

const client = new GraphQLClient(ENDPOINT);

export const attestionsApi = getSdk(client);
