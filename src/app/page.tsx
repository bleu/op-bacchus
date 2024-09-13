"use client";
import { useSigner } from "@/hooks/useSigner";
import { USER_ATTESTATIONS_QUERY } from "@/lib/gqlEasAttestation/query";
import { useQuery } from "urql";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { useChainId } from "wagmi";
import { parseEventsData } from "./events/parseEventsData";
import { fromUnixTime, format } from "date-fns";
import { enUS } from "date-fns/locale";
import React, { useState, useMemo } from "react";

function epochToCustomDate(epoch: number): string {
	try {
		const epochInSeconds = epoch.toString().length > 10 ? epoch / 1000 : epoch;

		const date = fromUnixTime(epochInSeconds);

		return format(date, "d, MMMM 'of' yyyy", { locale: enUS });
	} catch (error) {
		return "Invalid Date";
	}
}

interface DataEntry {
	attester: string;
	data: string;
	decodedDataJson: string;
	expirationTime: number;
	id: string;
	recipient: string;
	refUID: string;
	revocable: boolean;
	revocationTime: number;
}

function sortByStartsAt(data: DataEntry[]): DataEntry[] {
	return data.sort((a, b) => {
		const aDecoded = JSON.parse(a.decodedDataJson);
		const bDecoded = JSON.parse(b.decodedDataJson);

		const aStartsAt = aDecoded.find((item: any) => item.name === "startsAt")
			?.value.value.hex;
		const bStartsAt = bDecoded.find((item: any) => item.name === "startsAt")
			?.value.value.hex;

		if (!aStartsAt || !bStartsAt) return 0;

		return parseInt(aStartsAt, 16) - parseInt(bStartsAt, 16);
	});
}

export default function Events() {
	const signer = useSigner();
	const chainId = useChainId();
	const attester = signer?.address || "";
	const [searchTerm, setSearchTerm] = useState("");

	const [result] = useQuery({
		query: USER_ATTESTATIONS_QUERY,
		variables: { attester },
		context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
		pause: !signer,
	});

	const { data, fetching, error } = result;

	const filteredAttestations = useMemo(() => {
		if (!data?.attestations) return [];
		const currentTime = Date.now();
	  
		return sortByStartsAt(data.attestations).filter((attestation) => {
		  const decodedData = JSON.parse(attestation.decodedDataJson);
		  const parsedData = parseEventsData(attestation.decodedDataJson);
		  
		  // Filter out past events
		  if (parsedData.startsAt <= currentTime) {
			return false;
		  }
		  
		  const searchableFields = ['name', 'briefDescription', 'fullDescription'];
		  const searchableText = searchableFields
			.map(field => decodedData.find((item: any) => item.name === field)?.value?.value || '')
			.join(' ')
			.toLowerCase();
		
		  return searchableText.includes(searchTerm.toLowerCase());
		});
	  }, [data?.attestations, searchTerm]);

	const attestationList = useMemo(
		() =>
			filteredAttestations.map((attestation) => (
				<AttestationItem
					key={attestation.id}
					data={attestation.decodedDataJson}
				/>
			)),
		[filteredAttestations],
	);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	if (!signer) {
		return <div>Connect a wallet to view your attestations.</div>;
	}

	if (fetching) {
		return <div>Loading attestation data...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<>
			<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold my-12 text-center">
				Explore Your Next Event
			</h1>

			<form
				className="w-full flex justify-center"
				onSubmit={(e) => e.preventDefault()}
			>
				<input
					className="w-[50vw] h-12 mb-8 pl-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
					placeholder="Search"
					type="text"
					value={searchTerm}
					onChange={handleSearch}
				/>
			</form>

			{attestationList.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 w-full gap-y-12">
					{attestationList}
				</div>
			) : (
				<div className="text-center mt-10">
					No events found matching your search.
				</div>
			)}
		</>
	);
}

function AttestationItem({ data }: { data: any }) {
	const parsedData = parseEventsData(data);

	return (
		<div
			key="Event"
			className="border-2 rounded-lg w-[80vw] sm:w-[70vw] md:w-[50vw] lg:w-[25vw] h-auto gap-6 justify-self-center"
			>
			<div className="p-3">
				<h2 className="text-base font-bold">{parsedData.name}</h2>
				<p className="text-xs">{epochToCustomDate(parsedData.startsAt)}</p>
			</div>
			<div>
				<img
					className="w-full h-32"
					alt="Template image"
					src={parsedData.imageUrl}
				/>
			</div>
			<div className="p-3">
				<p className="text-xs text-gray-700 mb-4">
					Brief description: {parsedData.briefDescription}
				</p>
				<span className="text-xs bg-gray-100 px-2 py-1 rounded-lg inline-block">
					Status: published
				</span>
			</div>
		</div>
	);
}

