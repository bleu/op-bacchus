"use client";
import { AttestationItem } from "@/components/AttestationItem";
import { CREATE_EVENT_SCHEMA_UID } from "@/components/CreateEventSchemaButton";
import { useSigner } from "@/hooks/useSigner";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { EVENTS_ATTESTATIONS_QUERY } from "@/lib/gqlEasAttestation/query";
import { useMemo } from "react";
import { useQuery } from "urql";
import { useChainId } from "wagmi";

interface DataEntry {
  attester: string;
  data: string;
  decodedDataJson: string;
  expirationTime: number;
  id: string;
  recipient: string;
  refUID: string;
  revocable: boolean;
  revocationTime: number;
}

function sortByStartsAt(data: DataEntry[]): DataEntry[] {
  return data.sort((a, b) => {
    const aDecoded = JSON.parse(a.decodedDataJson);
    const bDecoded = JSON.parse(b.decodedDataJson);

    const aStartsAt = aDecoded.find((item: any) => item.name === "startsAt")
      ?.value.value.hex;
    const bStartsAt = bDecoded.find((item: any) => item.name === "startsAt")
      ?.value.value.hex;

    if (!aStartsAt || !bStartsAt) return 0;

    return Number.parseInt(aStartsAt, 16) - Number.parseInt(bStartsAt, 16);
  });
}

export default function Events() {
  const signer = useSigner();

  const chainId = useChainId();

  const attester = signer?.address || "";
  const [result] = useQuery({
    query: EVENTS_ATTESTATIONS_QUERY,
    variables: { schemaId: CREATE_EVENT_SCHEMA_UID },
    context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
    pause: !signer,
  });

  const { data } = result;

  const attestationList = useMemo(
    () =>
      data?.attestations &&
      sortByStartsAt(data.attestations).map((attestation) => (
        <AttestationItem
          id={attestation.id}
          key={attestation.id}
          data={attestation.decodedDataJson}
        />
      )),
    [data?.attestations],
  );

  if (!signer) {
    return <div>Connect a wallet to view your attestations.</div>;
  }

  if (!data) {
    return <div>Loading attestation data...</div>;
  }

  return (
    <div className="mx-20">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold my-12 text-center">
        Explore Your Next Event
      </h1>

      <form className="w-full flex justify-center">
        <input
          className="w-[50vw] h-12 mb-8 pl-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
          placeholder="Search"
          type="text"
        />
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {attestationList}
      </div>
    </div>
  );
}
