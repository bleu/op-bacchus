"use client";
import { useState, useEffect } from "react";
import { useSigner } from "@/hooks/useSigner";
import { attestationsApi } from "../../../package/gql/src/eas/sdk";
import { parseData } from "./utils";

interface AttestationData {
  attestations: Array<{
    id: string;
    decodedDataJson: string;
  }>;
}

export function AttestationList() {
  const signer = useSigner();
  const [attestationData, setAttestationData] = useState<AttestationData>({
    attestations: [],
  } as AttestationData);

  useEffect(() => {
    async function fetchAttestationData() {
      if (signer) {
        // Assuming AttestationList is an async function that returns some data
        const data = await attestationsApi.getAttestationsByAttester({
          attester: signer.address,
        });
        //@ts-ignore
        setAttestationData(data);
      }
    }

    fetchAttestationData();
  }, [signer]);

  if (!signer) {
    return <div>Account not found</div>;
  }

  if (!attestationData) {
    return <div>Loading attestation data...</div>;
  }

  console.log(attestationData);
  return (
    <>
      <h2>Attestations</h2>
      <div>
        {attestationData.attestations.map((data: any) => (
          <AttestationItem key={data.id} data={data.decodedDataJson} />
        ))}
      </div>
    </>
  );
}

function AttestationItem({ data }: { data: any }) {
  const parsedData = parseData(data);
  console.log(parsedData);

  return (
    <div>
      <div>{parsedData.name}</div>
      <div>{parsedData.briefDescription}</div>
      <div>{parsedData.startsAt}</div>
    </div>
  );
}
