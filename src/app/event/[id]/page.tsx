"use client";

import { useAccount } from "wagmi";
import { format } from "date-fns";

import {
  EventInfoContainer,
  StatusFlag,
  OtherInfoSection,
} from "../components/PageComponents";
import { Calendar } from "lucide-react";
import { useEventData } from "../hooks/useEventData";
import { Address } from "viem";
import { useTicketAddresses } from "../hooks/useTicketAddresses";

export default function Page({ params }: { params: { id: string } }) {
  const eventId = params.id;

  const account = useAccount();

  const {
    eventData,
    fetching: fetchingEvent,
    error: errorEvent,
  } = useEventData({ eventId });

  const { ticketAddresses } = useTicketAddresses({ eventId, eventData });

  if (!account) return <p>Please connect wallet to load the informations...</p>;

  if (eventData === undefined) return <p>loading...</p>;

  if (eventData === null)
    return <p>It seems that this event does not exist.</p>;

  if (ticketAddresses === undefined) return <p>Loading...</p>;

  const datetimeFormatted = format(
    new Date(eventData.startsAt),
    "d, MMMM, yyyy 'at' ha."
  );

  const userIsEventOwner = account.address === eventData.owner;

  const userHasTicket = account.address
    ? ticketAddresses.includes(account.address)
    : false;

  return (
    <main className="flex flex-col items-center justify-center gap-y-10 mx-20 my-10 xl:px-[10%]">
      <div
        className="bg-contain bg-center bg-no-repeat w-full h-[450px]  block p-8 border-2 rounded-3xl"
        style={{ backgroundImage: `url(${eventData.imageUrl})` }}
      ></div>
      <EventInfoContainer>
        <div className="flex flex-col md:flex-row md:justify-between">
          <h1 className="text-4xl font-bold mb-4">{eventData.name}</h1>
          <StatusFlag />
        </div>
        <div className="flex items-center gap-x-2">
          <Calendar className="size-4" />
          <p>{datetimeFormatted}</p>
        </div>
      </EventInfoContainer>
      <OtherInfoSection
        eventId={eventId}
        eventData={eventData}
        ticketAddresses={ticketAddresses as Address[]}
        userIsEventOwner={userIsEventOwner}
        userHasTicket={userHasTicket}
      />
    </main>
  );
}
