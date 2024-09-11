"use client";
import { useSigner } from "@/hooks/useSigner";
import { USER_ATTESTATIONS_QUERY } from "@/lib/gqlEasAttestation/query";
import { useQuery } from "urql";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { useChainId } from "wagmi";
import { useMemo } from "react";
import { parseEventsData } from "./parseEventsData";

function epochToCustomDate(epoch: number): string {
	const date: Date = new Date(epoch);

	// Get the day, month, and year
	const day: number = date.getUTCDate();
	const month: string = date.toLocaleString("default", {
		month: "long",
		timeZone: "UTC",
	});
	const year: number = date.getUTCFullYear();

	// Format the date string
	return `${day}, ${month} of ${year}`;
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
	const [result] = useQuery({
		query: USER_ATTESTATIONS_QUERY,
		variables: { attester },
		context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
		pause: !signer,
	});

	const { data, fetching, error } = result;

	const attestationList = useMemo(
		() =>
			data?.attestations &&
			sortByStartsAt(data.attestations).map((attestation) => (
				<AttestationItem
					key={attestation.id}
					data={attestation.decodedDataJson}
				/>
			)),
		[data?.attestations],
	);

	if (!signer) {
		return <div>Connect a wallet to view your attestations.</div>;
	}

	if (!data) {
		return <div>Loading attestation data...</div>;
	}

	return (
		<>
			<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold my-12 text-center">
				Explore Your Next Event
			</h1>

			<form className="w-full flex justify-center">
				<input
					className="w-[50vw] h-12 mb-8 pl-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
					placeholder="Search"
					type="text"
				/>
			</form>
    </>      
)

}

function AttestationItem({ data }: { data: any }) {
	const parsedData = parseEventsData(data);

  return (
    <div className="border-2 rounded-lg w-60">
      <div className="p-3">
        <h1 className="text-base font-bold">{parsedData.name}</h1>
        <h2 className="text-xs">{parsedData.startsAt}</h2>
      </div>
      <div>
        <img className="w-full h-auto" alt="Template image" src={parsedData.imageUrl} />
      </div>
      <div className="p-3">
        <h2 className="text-xs text-gray-700 mb-4">Brief description: {parsedData.briefDescription}</h2>
        <h2 className="text-xs text-gray-700 mb-4">Full description: {parsedData.fullDescription}</h2>
      </div>
    </div>

  );
}

