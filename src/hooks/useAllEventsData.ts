import { CREATE_EVENT_SCHEMA_UID } from "@/hooks/useCreateEventAttestation";
import { useSigner } from "@/hooks/useSigner";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { EVENTS_ATTESTATIONS_QUERY } from "@/lib/gqlEasAttestation/query";
import type { DataEntry } from "@/types";
import { useMemo } from "react";
import { useQuery } from "urql";
import { useChainId } from "wagmi";

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

export const useAllEventsData = () => {
  const signer = useSigner();

  const chainId = useChainId();

  const [result] = useQuery({
    query: EVENTS_ATTESTATIONS_QUERY,
    variables: { schemaId: CREATE_EVENT_SCHEMA_UID },
    context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
    pause: !signer,
  });

  const { data, fetching, error } = result;

  const allEventsData = useMemo(
    () => data?.attestations && sortByStartsAt(data?.attestations),
    [data?.attestations],
  );

  return { allEventsData, fetching, error, signer };
};
