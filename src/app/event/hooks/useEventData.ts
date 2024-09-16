import { GET_ATTESTATION_BY_ID_QUERY } from "@/lib/gqlEasAttestation/query";
import { useQuery } from "urql";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { useMemo } from "react";
import { useChainId } from "wagmi";
import { parseEventsData } from "@/app/events/parseEventsData";

export const useEventData = ({ eventId }: { eventId: string }) => {
  const chainId = useChainId();
  const [result] = useQuery({
    query: GET_ATTESTATION_BY_ID_QUERY,
    variables: { id: eventId },
    context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
  });

  const { data, fetching, error } = result;

  const eventData = useMemo(
    () =>
      data?.attestation && parseEventsData(data.attestation?.decodedDataJson),
    [data?.attestation]
  );

  return { eventData, fetching, error };
};
