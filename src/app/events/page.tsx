"use client";
import { useSigner } from "@/hooks/useSigner";
import { USER_ATTESTATIONS_QUERY } from "@/lib/gqlEasAttestation/query";
import { useQuery } from "urql";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { useChainId } from "wagmi";
import { useMemo } from "react";
import { parseEventsData } from "./parseEventsData";
import Link from "next/link";

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
        <AttestationItem
          key={data.id}
          id={data.id}
          data={data.decodedDataJson}
        />
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
    <div className="mx-20">
      <h2>Attestations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {attestationList}
      </div>
    </div>
  );
}

function AttestationItem({ id, data }: { id: string; data: any }) {
  const parsedData = parseEventsData(data);

  return (
    <Link
      href={`/event/${id}`}
      className="border-2 rounded-lg w-60 hover:border-slate-600"
    >
      {/* <div className=""> */}
      <div className="p-3">
        <h1 className="text-base font-bold">{parsedData.name}</h1>
        <h2 className="text-xs">{parsedData.startsAt}</h2>
      </div>
      <div>
        <img
          className="w-full h-auto"
          alt="Template image"
          src={parsedData.imageUrl}
        />
      </div>
      <div className="p-3">
        <h2 className="text-xs text-gray-700 mb-4">
          Brief description: {parsedData.briefDescription}
        </h2>
        <h2 className="text-xs text-gray-700 mb-4">
          Full description: {parsedData.fullDescription}
        </h2>
      </div>
      {/* </div> */}
    </Link>
  );
}
