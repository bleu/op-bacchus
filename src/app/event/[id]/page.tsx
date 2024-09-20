"use client";

import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { useMemo } from "react";
import type { Address } from "viem";
import { useAccount, useChainId } from "wagmi";
import { parseEventsData } from "../../events/parseEventsData";
import {
  EventInfoContainer,
  OtherInfoSection,
  StatusFlag,
} from "../components/PageComponents";
import { useEventData } from "../hooks/useEventData";
import { useTicketAddresses } from "../hooks/useTicketAddresses";

export default function Page({ params }: { params: { id: string } }) {
  const eventId = params.id;

  const account = useAccount();

  const {
    eventData,
    fetching: fetchingEvent,
    error: errorEvent,
  } = useEventData({ eventId });

  const parsedData = useMemo(
    () =>
      eventData?.attestation &&
      parseEventsData(eventData.attestation?.decodedDataJson),
    [eventData?.attestation],
  );
  const { ticketAddresses, userHasTicket, userTicket } = useTicketAddresses({
    eventId,
    eventData,
  });

  if (!account) return <p>Please connect wallet to load the informations...</p>;

  if (eventData === undefined) return <p>loading...</p>;

  if (eventData === null)
    return <p>It seems that this event does not exist.</p>;

  const startsAtFormatted = format(
    new Date(parsedData.startsAt),
    "d, MMMM, yyyy 'at' ha.",
  );

  const endsAtFormatted = format(
    new Date(parsedData.endsAt),
    "d, MMMM, yyyy 'at' ha.",
  );
  if (ticketAddresses === undefined) return <p>Loading...</p>;
  const userIsEventOwner = account.address === eventData.owner;

  return (
    <main className="flex flex-col items-center justify-center gap-y-10 mx-20 my-10 xl:px-[10%]">
      <div
        className="bg-contain bg-center bg-no-repeat w-full h-[450px]  block p-8 border-2 rounded-3xl"
        style={{ backgroundImage: `url(${parsedData.imageUrl})` }}
      />
      <EventInfoContainer>
        <div className="flex flex-col md:flex-row md:justify-between">
          <h1 className="text-4xl font-bold mb-4">{eventData.name}</h1>
          <StatusFlag />
        </div>
        <div className="flex items-center gap-x-2">
          <Calendar className="size-4" />
          <p>
            {startsAtFormatted} - {endsAtFormatted}
          </p>
        </div>
      </EventInfoContainer>
      <OtherInfoSection
        eventId={eventId}
        eventData={eventData}
        ticketAddresses={ticketAddresses as Address[]}
        userIsEventOwner={userIsEventOwner}
        userHasTicket={userHasTicket}
        userTicket={userTicket}
      />
    </main>
  );
}
