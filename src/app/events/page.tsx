"use client";

import { AttestationItem } from "@/components/AttestationItem";
import type { DataEntry } from "@/hooks/useAllEventsData";
import { useHostedEventsData } from "@/hooks/useHostedEventsData";
import Link from "next/link";
import type React from "react";
import { useMemo, useState } from "react";
import { parseEventsData } from "./parseEventsData";

export default function MyEvents() {
  const [searchTerm, setSearchTerm] = useState("");
  const { hostedEventsData, signer } = useHostedEventsData();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredAttestations = useMemo(() => {
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
      filteredAttestations.map((attestation: DataEntry) => (
        <AttestationItem
          id={attestation.id}
          key={attestation.id}
          data={attestation.decodedDataJson}
        />
      )),
    [filteredAttestations],
  );

  if (!signer) {
    return <div>Connect a wallet to view your attestations.</div>;
  }

  if (!hostedEventsData) {
    return <div>Loading attestation data...</div>;
  }

  return (
    <div className="mx-20">
      <div className="mt-12 mb-3">
        <div className="flex items-center justify-between mb-2">
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
      </div>
      <form className="w-full flex justify-center items-center gap-4 mb-12">
        <input
          className="w-full h-12 pl-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
          placeholder="Search"
          type="text"
          value={searchTerm}
          onChange={handleSearch}
        />
      </form>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-base font-bold">Hosted by me</h1>
        </div>
        <hr className="border-t border-gray-300 w-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 w-full gap-y-12">
        {attestationList.length > 0 ? (
          attestationList
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No events found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
