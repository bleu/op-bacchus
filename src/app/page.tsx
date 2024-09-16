"use client";
import { useSigner } from "@/hooks/useSigner";
import { EVENTS_ATTESTATIONS_QUERY } from "@/lib/gqlEasAttestation/query";
import { useQuery } from "urql";
import { API_URL_MAPPING, EVENT_SCHEMA_ID } from "@/lib/gqlEasAttestation";
import { useChainId } from "wagmi";
import { parseEventsData } from "./events/parseEventsData";
import React, { useState, useMemo } from "react";
import { AttestationItem, sortByStartsAt } from "./events/page";

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

export default function Events() {
	const signer = useSigner();
	const chainId = useChainId();
	const attester = signer?.address || "";
	const [searchTerm, setSearchTerm] = useState("");

	const [result] = useQuery({
		query: EVENTS_ATTESTATIONS_QUERY,
		variables: { schemaId: EVENT_SCHEMA_ID },
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
			if (parsedData.endsAt <= currentTime) {
				return false;
			}

			const searchableFields = ["name", "briefDescription", "fullDescription"];
			const searchableText = searchableFields
				.map(
					(field) =>
						decodedData.find((item: any) => item.name === field)?.value
							?.value || "",
				)
				.join(" ")
				.toLowerCase();

			return searchableText.includes(searchTerm.toLowerCase());
		});
	}, [data?.attestations, searchTerm]);

	const attestationList = useMemo(
		() =>
			filteredAttestations.map((attestation) => (
				<AttestationItem
					id={attestation.id}
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
		<div className="mx-20">
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
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
					{attestationList}
				</div>
			) : (
				<div className="text-center mt-10">
					No events found matching your search.
				</div>
			)}
		</div>
	);
}
