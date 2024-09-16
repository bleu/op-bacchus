"use client";
import { useSigner } from "@/hooks/useSigner";
import { USER_ATTESTATIONS_QUERY } from "@/lib/gqlEasAttestation/query";
import { useQuery } from "urql";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { useChainId } from "wagmi";
import { useMemo } from "react";
import { fromUnixTime, format } from "date-fns";
import { enUS } from "date-fns/locale";
import { parseEventsData } from "./parseEventsData";
import Link from "next/link";

function epochToCustomDate(epoch: number): string {
  try {
    const epochInSeconds = epoch.toString().length > 10 ? epoch / 1000 : epoch;

    const date = fromUnixTime(epochInSeconds);

    return format(date, "d, MMMM 'of' yyyy", { locale: enUS });
  } catch (error) {
    return "Invalid Date";
  }
}

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

    return parseInt(aStartsAt, 16) - parseInt(bStartsAt, 16);
  });
}

export default function Events() {
  const signer = useSigner();

  const chainId = useChainId();

  const attester = signer?.address || "";
  const [result] = useQuery({
    query: USER_ATTESTATIONS_QUERY,
		variables: { attester, schemaId: EVENT_SCHEMA_ID },
    context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
    pause: !signer,
  });

  const { data, fetching, error } = result;

  const attestationList = useMemo(
    () =>
      data?.attestations &&
      sortByStartsAt(data.attestations).map((attestation) => (
        <AttestationItem
          key={attestation.id}
          id={attestation.id}
          data={attestation.decodedDataJson}
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
    </Link>
  );
}
