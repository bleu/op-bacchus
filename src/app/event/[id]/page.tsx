"use client";

import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { GET_ATTESTATION_BY_ID_QUERY } from "@/lib/gqlEasAttestation/query";
import { format } from "date-fns";
import { useMemo } from "react";
import { useQuery } from "urql";
import { useAccount, useChainId } from "wagmi";
import { parseEventsData } from "../../events/parseEventsData";

import { Modal } from "../Modal";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import {
  EventInfoContainer,
  StatusFlag,
  Ticket,
  TicketInfoContainer,
  TicketInfoHeaderContainer,
} from "../components/PageComponents";

const ticketAddresses = [
  { address: "0xkamscknsadkcnaksdncjsdncsjdn" },
  { address: "0xkamscknsadkcnaksdncjsdncsjab" },
  { address: "0xkamscknsadkcnaksdncjsdncsjac" },
];

export default function Page({ params }: { params: { id: string } }) {
  const eventId = params.id;

  const account = useAccount();
  const chainId = useChainId();

  const [result] = useQuery({
    query: GET_ATTESTATION_BY_ID_QUERY,
    variables: { id: eventId },
    context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
  });

  const { data, fetching, error } = result;

  const parsedData = useMemo(
    () =>
      data?.attestation && parseEventsData(data.attestation?.decodedDataJson),
    [data?.attestation],
  );

  if (!account) return <p>Please connect wallet to load the informations...</p>;

  if (parsedData === undefined) return <p>loading...</p>;

  if (parsedData === null)
    return <p>It seems that this event does not exist.</p>;

	const startsAtFormatted = format(
		new Date(parsedData.startsAt),
		"d, MMMM, yyyy 'at' ha.",
	);

	const endsAtFormatted = format(
		new Date(parsedData.endsAt),
		"d, MMMM, yyyy 'at' ha.",
	);
  const userIsOwner = account.address === parsedData.owner;

  return (
    <main className="flex flex-col items-center justify-center gap-y-10 mx-20 my-10 xl:px-[10%]">
      <div
        className="bg-contain bg-center bg-no-repeat w-full h-[450px]  block p-8 border-2 rounded-3xl"
        style={{ backgroundImage: `url(${parsedData.imageUrl})` }}
      />
      <EventInfoContainer>
        <div className="flex flex-col md:flex-row md:justify-between">
          <h1 className="text-4xl font-bold mb-4">{parsedData.name}</h1>
          <StatusFlag />
        </div>
        <div className="flex items-center gap-x-2">
          <Calendar className="size-4" />
          <p>{startsAtFormatted} - {endsAtFormatted}</p>
        </div>
      </EventInfoContainer>
      <TicketInfoContainer>
        <Tabs defaultValue="about">
          <TicketInfoHeaderContainer>
            <TabsList>
              <TabsTrigger
                value="about"
                className="rounded-none border-b data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-600"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="tickets"
                className="rounded-none border-b data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-600"
              >
                Tickets
              </TabsTrigger>
            </TabsList>
            {userIsOwner ? <Modal eventId={eventId} /> : undefined}
          </TicketInfoHeaderContainer>
          <TabsContent value="about">
            <span>Description</span>: {parsedData.fullDescription}
          </TabsContent>
          <TabsContent value="tickets">
            <div className="block mt-4">
              {ticketAddresses.map((ticket) => {
                return <Ticket key={ticket.address} address={ticket.address} />;
              })}
            </div>
          </TabsContent>
        </Tabs>
      </TicketInfoContainer>
    </main>
  );
}
