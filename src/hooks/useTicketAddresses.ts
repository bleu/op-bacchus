import type { TicketInfoType } from "@/app/event/components/UserTicket";
import type { Event } from "@/hooks/useCreateEventAttestation";
import { CREATE_TICKET_SCHEMA_UID } from "@/hooks/useCreateTicketMultiAttestations";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { GET_TICKETS_BY_EVENT_QUERY } from "@/lib/gqlEasAttestation/query";
import { useMemo } from "react";
import { useQuery } from "urql";
import { useAccount, useChainId } from "wagmi";

export const useTicketAddresses = ({
  eventId,
  eventData,
}: {
  eventId: string;
  eventData: Event | null | undefined;
}) => {
  const chainId = useChainId();
  const account = useAccount();
  const [result] = useQuery({
    query: GET_TICKETS_BY_EVENT_QUERY,
    variables: { schemaId: CREATE_TICKET_SCHEMA_UID, eventId },
    context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
    pause: !eventData,
  });

  const { data, fetching, error } = result;

  const ticketAddresses = useMemo(
    () =>
      data?.attestations &&
      data.attestations.map((ticket: TicketInfoType) => {
        return ticket?.recipient;
      }),
    [data?.attestations],
  );

  const userHasTicket =
    account.address && ticketAddresses
      ? ticketAddresses.includes(account.address)
      : false;

  const userTicket = useMemo(
    () =>
      data?.attestations &&
      data.attestations.filter(
        (ticket: TicketInfoType) => ticket?.recipient === account.address,
      )[0],
    [data?.attestations, account],
  );

  // WILL BE USED IN THE FUTURE
  // const ticketsInternalData = useMemo(
  //   () =>
  //     data?.attestations && parseTicketsData(data.attestations?.decodedDataJson),
  //   [data?.attestations]
  // );

  return { ticketAddresses, fetching, error, userHasTicket, userTicket };
};
