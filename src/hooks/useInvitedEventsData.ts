import { useSigner } from "@/hooks/useSigner";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import {
  GET_TICKET_ATTESTATION_BY_EVENT_ID_QUERY,
  TICKET_BY_RECIPIENT_QUERY,
} from "@/lib/gqlEasAttestation/query";
import { sortByStartsAt } from "@/lib/utils";
import { useMemo } from "react";
import { useQuery } from "urql";
import { useChainId } from "wagmi";
import { CREATE_TICKET_SCHEMA_UID } from "./useCreateTicketMultiAttestations";

interface TicketData {
  id: string;
  attester: string;
  decodedDataJson: string;
  recipient: string;
  refUID: string;
}

export const useInvitedEventsData = () => {
  const signer = useSigner();

  const attester = signer?.address || "";

  const chainId = useChainId();

  const [ticketsResult] = useQuery({
    query: TICKET_BY_RECIPIENT_QUERY,
    variables: {
      recipient: attester,
      schemaId: CREATE_TICKET_SCHEMA_UID,
    },
    context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
    pause: !signer,
  });

  const {
    data: ticketsData,
    fetching: ticketsFetching,
    error: ticketsError,
  } = ticketsResult;

  const { invitationIdentifiers } = useMemo(() => {
    if (!ticketsData || !ticketsData.attestations) {
      return { processedInvitations: null, invitationIdentifiers: [] };
    }

    const validInvitations = ticketsData.attestations.filter(
      (invitation: TicketData) =>
        invitation !== undefined &&
        invitation !== null &&
        invitation.refUID !== undefined &&
        invitation.refUID !== null &&
        invitation.refUID !== "",
    );

    const invitationIdentifiers = validInvitations.map(
      (invitation: TicketData) => invitation.refUID,
    );

    return {
      processedInvitations:
        validInvitations.length > 0 ? { attestations: validInvitations } : null,
      invitationIdentifiers,
    };
  }, [ticketsData]);

  const [ticket_events_result] = useQuery({
    query: GET_TICKET_ATTESTATION_BY_EVENT_ID_QUERY,
    variables: { ids: invitationIdentifiers },
    context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
    pause: !signer,
  });

  const { data, fetching, error } = ticket_events_result;

  const eventsWithTicketData = useMemo(
    () => data?.attestations && sortByStartsAt(data?.attestations),
    [data?.attestations],
  );

  return { eventsWithTicketData, fetching, error, signer };
};
