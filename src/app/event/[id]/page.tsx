"use client";

import { useSigner } from "@/hooks/useSigner";
import { GET_ATTESTATION_BY_ID_QUERY } from "@/lib/gqlEasAttestation/query";
import { useQuery } from "urql";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { useChainId } from "wagmi";
import { useMemo } from "react";
import { parseEventsData } from "../../events/parseEventsData";
import { format } from "date-fns";
import {
  AssignTicketButton,
  EventInfoContainer,
  StatusFlag,
  Ticket,
  TicketInfoContainer,
  TicketInfoHeaderContainer,
} from "../components";

const ticketAddresses = [
  { address: "0xkamscknsadkcnaksdncjsdncsjdn" },
  { address: "0xkamscknsadkcnaksdncjsdncsjab" },
  { address: "0xkamscknsadkcnaksdncjsdncsjac" },
];

export default function Page({ params }: { params: { id: string } }) {
  const eventId = params.id;

  const signer = useSigner();
  const chainId = useChainId();

  const [result] = useQuery({
    query: GET_ATTESTATION_BY_ID_QUERY,
    variables: { id: eventId },
    context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
    pause: !signer,
  });

  const { data, fetching, error } = result;

  const parsedData = useMemo(
    () =>
      data?.attestation && parseEventsData(data.attestation?.decodedDataJson),
    [data?.attestation]
  );

  if (parsedData === undefined) return <p>loading...</p>;

  if (parsedData === null)
    return <p>It seems that this event does not exist.</p>;

  const datetimeFormatted = format(
    new Date(parsedData.startsAt),
    "d, MMMM, yyyy 'at' ha."
  );

  return (
    <main className="flex flex-col items-center justify-center gap-y-10">
      <EventInfoContainer>
        <StatusFlag />
        <h1 className="text-4xl font-bold mb-4">{parsedData.name}</h1>
        <p className="mb-4">{datetimeFormatted}</p>
        <p>{parsedData.briefDescription}</p>
      </EventInfoContainer>
      <TicketInfoContainer>
        <TicketInfoHeaderContainer>
          <strong className="ml-4 text-lg">Assigned Tickets</strong>
          <AssignTicketButton />
        </TicketInfoHeaderContainer>
        <div className="block mt-4">
          {ticketAddresses.map((ticket) => {
            return <Ticket key={ticket.address} address={ticket.address} />;
          })}
        </div>
      </TicketInfoContainer>
    </main>
  );
}
