"use client";

import { useSigner } from "@/hooks/useSigner";
import { parseData } from "./utils";
import { USER_ATTESTATIONS_QUERY } from "@/lib/gqlEasAttestation/query";
import { useQuery } from "urql";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { optimismSepolia, sepolia } from "viem/chains";
import { useChainId } from "wagmi";
import { useMemo } from "react";

interface AttestationData {
  attestations: Array<{
    id: string;
    decodedDataJson: string;
  }>;
}

export function AttestationList() {
  const signer = useSigner();
  // const [attestationData, setAttestationData] = useState<AttestationData>({
  //   attestations: [],
  // } as AttestationData);

  const chainId = useChainId();

  console.log(signer?.address, chainId);
  const attester = signer?.address || "";
  const [result] = useQuery({
    query: USER_ATTESTATIONS_QUERY,
    variables: { attester },
    context: { url: API_URL_MAPPING[chainId] },
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
      {/* <div>
        {attestationData.attestations.map((data: any) => (
          <AttestationItem key={data.id} data={data.decodedDataJson} />
        ))}
      </div> */}
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
