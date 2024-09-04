"use client";

import { useSigner } from "@/hooks/useSigner";
import { parseData } from "./utils";
import { USER_ATTESTATIONS_QUERY } from "@/lib/gqlEasAttestation/query";
import { useQuery } from "urql";

interface AttestationData {
  attestations: Array<{
    id: string;
    decodedDataJson: string;
  }>;
}

export function AttestationList() {
  const signer = useSigner();

  const [result] = useQuery({
    query: USER_ATTESTATIONS_QUERY,
    variables: { asttester: signer?.address },
  });

  if (!result.data) {
    return <div>Loading attestation data...</div>;
  }

  return (
    <>
      <h2>Attestations</h2>
      <div>
        {result.data.attestations.map((data: any) => (
          <AttestationItem key={data.id} data={data.decodedDataJson} />
        ))}
      </div>
    </>
  );
}

function AttestationItem({ data }: { data: any }) {
  const parsedData = parseData(data);

  return (
    <div>
      <div>{parsedData.name}</div>
      <div>{parsedData.briefDescription}</div>
      <div>{parsedData.startsAt}</div>
    </div>
  );
}
