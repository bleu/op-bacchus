import { CREATE_EVENT_SCHEMA_UID } from "@/hooks/useCreateEventAttestation";
import { useSigner } from "@/hooks/useSigner";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { USER_ATTESTATIONS_QUERY } from "@/lib/gqlEasAttestation/query";
import { sortByStartsAt } from "@/lib/utils";
import { useMemo } from "react";
import { useQuery } from "urql";
import { useChainId } from "wagmi";

export const useHostedEventsData = () => {
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

  const hostedEventsData = useMemo(
    () => data?.attestations && sortByStartsAt(data?.attestations),
    [data?.attestations],
  );

  return { hostedEventsData, fetching, error, signer };
};
