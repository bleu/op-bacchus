"use client";

import { AttestationItem } from "@/components/AttestationItem";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useHostedEventsData } from "@/hooks/useHostedEventsData";
import { useInvitedEventsData } from "@/hooks/useInvitedEventsData";
import type { DataEntry } from "@/types";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import type React from "react";
import { useMemo, useState } from "react";
import { parseEventsData } from "./parseEventsData";

export default function MyEvents() {
  const [searchTerm, setSearchTerm] = useState("");
  const { hostedEventsData, signer, fetching } = useHostedEventsData();

  const { eventsWithTicketData, fetching: invitedFetching } =
    useInvitedEventsData();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredHostedEvents = useMemo(() => {
    if (!hostedEventsData) return [];
    return hostedEventsData.filter((attestation: DataEntry) => {
      const parsedData = parseEventsData(attestation.decodedDataJson);
      const searchableText =
        `${parsedData.name} ${parsedData.briefDescription}`.toLowerCase();
      const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [hostedEventsData, searchTerm]);

  const attestationList = useMemo(
    () =>
      filteredHostedEvents.map((attestation: DataEntry) => (
        <AttestationItem
          id={attestation.id}
          key={attestation.id}
          data={attestation.decodedDataJson}
        />
      )),
    [filteredHostedEvents],
  );

  const filteredInvitedEvents = useMemo(() => {
    if (!eventsWithTicketData) return [];
    return eventsWithTicketData.filter((attestation: DataEntry) => {
      const parsedData = parseEventsData(attestation.decodedDataJson);
      const searchableText =
        `${parsedData.name} ${parsedData.briefDescription}`.toLowerCase();
      const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [eventsWithTicketData, searchTerm]);

  const invitedList = useMemo(
    () =>
      filteredInvitedEvents.map((attestation: DataEntry) => (
        <AttestationItem
          id={attestation.id}
          key={attestation.id}
          data={attestation.decodedDataJson}
        />
      )),
    [filteredInvitedEvents],
  );

  if (!signer && !fetching && !invitedFetching) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-screen -mt-36">
        Connect a wallet to view your attestations.
        <ConnectButton />
      </div>
    );
  }

  if (fetching || invitedFetching) {
    return (
      <div className="flex items-center justify-center h-screen -mt-36">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="mx-20 flex flex-col gap-y-5 mb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold truncate mr-2">
          My Events
        </h1>
        <Link
          href="/events/new"
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded flex items-center text-xs sm:text-sm md:text-base whitespace-nowrap"
        >
          <span className="text-sm sm:text-lg md:text-xl mr-1">+</span>
          <span>Create Event</span>
        </Link>
      </div>
      <hr className="border-t border-gray-300 w-full" />
      <form className="w-full flex justify-center items-center gap-4">
        <input
          className="w-full h-12 pl-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
          placeholder="Search"
          type="text"
          value={searchTerm}
          onChange={handleSearch}
        />
      </form>
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold">Hosted by me</h1>
      </div>
      <hr className="border-t border-gray-300 w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-y-12">
        {attestationList.length > 0 ? (
          attestationList
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No events found matching your search.
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-base font-bold">Invitations</h1>
      </div>
      <hr className="border-t border-gray-300 w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-y-12">
        {invitedList.length > 0 ? (
          invitedList
        ) : (
          <div className="col-span-full text-center text-gray-500">
            You have not been invited to any events.
          </div>
        )}
      </div>
    </div>
  );
}
