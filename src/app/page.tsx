"use client";
import { AttestationItem } from "@/components/AttestationItem";
import { useMemo, useState } from "react";
import {
  type DataEntry,
  useAllEventsData,
} from "./event/hooks/useAllEventsData";
import { parseEventsData } from "./events/parseEventsData";

export default function AllEvents() {
  const [searchTerm, setSearchTerm] = useState("");
  const { allEventsData, signer } = useAllEventsData();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredAttestations = useMemo(() => {
    if (!allEventsData) return [];
    return allEventsData.filter((attestation: DataEntry) => {
      const parsedData = parseEventsData(attestation.decodedDataJson);
      const searchableText =
        `${parsedData.name} ${parsedData.briefDescription}`.toLowerCase();
      const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [allEventsData, searchTerm]);

  const attestationList = useMemo(
    () =>
      filteredAttestations &&
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

  if (!allEventsData) {
    return <div>Loading attestation data...</div>;
  }

  return (
    <div className="mx-20">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold my-12 text-center">
        Explore Your Next Event
      </h1>

      <form className="w-full flex justify-center">
        <input
          className="w-[50vw] h-12 mb-8 pl-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
          placeholder="Search"
          type="text"
          value={searchTerm}
          onChange={handleSearch}
        />
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {attestationList}
      </div>
    </div>
  );
}
