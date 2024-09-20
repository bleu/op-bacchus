import { CREATE_EVENT_SCHEMA_UID } from "@/hooks/useCreateEventAttestation";
import { useSigner } from "@/hooks/useSigner";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { USER_ATTESTATIONS_QUERY } from "@/lib/gqlEasAttestation/query";
import { useMemo } from "react";
import { useQuery } from "urql";
import { useChainId } from "wagmi";

export interface DataEntry {
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

export const useOwnedEventsData = () => {
  const signer = useSigner();

  const attester = signer?.address || "";

  const chainId = useChainId();

  const [result] = useQuery({
    query: USER_ATTESTATIONS_QUERY,
    variables: { attester, schemaId: CREATE_EVENT_SCHEMA_UID },
    context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
    pause: !signer,
  });

  const { data, fetching, error } = result;

  const ownedEventsData = useMemo(
    () => data?.attestations && sortByStartsAt(data?.attestations),
    [data?.attestations],
  );

  return { ownedEventsData, fetching, error, signer };
};
