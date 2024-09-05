"use client";
import { useSigner } from "@/hooks/useSigner";
import { USER_ATTESTATIONS_QUERY } from "@/lib/gqlEasAttestation/query";
import { useQuery } from "urql";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { useChainId } from "wagmi";
import { useMemo } from "react";
import { parseEventsData } from "./parseEventsData";

export default function Events() {
  const signer = useSigner();

  const chainId = useChainId();

  const attester = signer?.address || "";
  const [result] = useQuery({
    query: USER_ATTESTATIONS_QUERY,
    variables: { attester },
    context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
    pause: !signer,
  });

  const { data, fetching, error } = result;

  const attestationList = useMemo(
    () =>
      data?.attestations &&
      data.attestations.map((data: any) => (
        <AttestationItem key={data.id} data={data.decodedDataJson} />
      )),
    [data?.attestations]
  );

  if (!signer) {
    return <div>Connect a wallet to view your attestations.</div>;
  }

  if (!data) {
    return <div>Loading attestation data...</div>;
  }

  return (
    <>
      <h2>Attestations</h2>
      <div>{attestationList}</div>
    </>
  );
}

function AttestationItem({ data }: { data: any }) {
  const parsedData = parseEventsData(data);

  return (
    <div>
      <div>{parsedData.name}</div>
      <div>{parsedData.briefDescription}</div>
      <div>{parsedData.startsAt}</div>
    </div>
  );
}
