"use client";
import { useSigner } from "@/hooks/useSigner";
import { USER_ATTESTATIONS_QUERY } from "@/lib/gqlEasAttestation/query";
import { useQuery } from "urql";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { useChainId } from "wagmi";
import { useMemo } from "react";
import { fromUnixTime, format } from "date-fns";
import { enUS } from "date-fns/locale";
import { parseEventsData } from "./parseEventsData";

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
			<div className="px-4 sm:px-12">
				<div className="mt-12 mb-3">
					<div className="flex items-center justify-between mb-2">
						<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold truncate mr-2">
							My Events
						</h1>
						<button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded flex items-center text-xs sm:text-sm md:text-base whitespace-nowrap">
							<span className="text-sm sm:text-lg md:text-xl mr-1">+</span>
							<span>Create Event</span>
						</button>
					</div>
					<hr className="border-t border-gray-300 w-full" />
				</div>

				<form className="w-full flex justify-center items-center gap-4 mb-12">
					<input
						className="w-[70%] h-12 pl-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
						placeholder="Search"
						type="text"
					/>
					<select className="w-[30%] h-12 pl-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500">
						<option value="">All status</option>
						<option value="Published">Published</option>
						<option value="Finished">Finished</option>
						<option value="Archived">Archived</option>
					</select>
				</form>

				<div className="mb-3">
					<div className="flex items-center justify-between mb-1">
						<h1 className="text-base font-bold">
							Hosted by me
						</h1>
					</div>
					<hr className="border-t border-gray-300 w-full" />
				</div>
			

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 w-full gap-y-12">
				{attestationList}
			</div>

			<div className="mb-3">
					<div className="flex items-center justify-between mt-6 mb-1">
						<h1 className="text-base font-bold">
							Invitations
						</h1>
					</div>
					<hr className="border-t border-gray-300 w-full" />
					ABCS
			</div>
			</div>

		</>
	);
}

function AttestationItem({ data }: { data: any }) {
	const parsedData = parseEventsData(data);

	return (
		<div
			key="Event"
			className="border-2 rounded-lg w-60 h-45 gap-6 justify-self-center"
		>
			<div className="p-3">
				<h2 className="text-base font-bold">{parsedData.name}</h2>
				<p className="text-xs">{epochToCustomDate(parsedData.startsAt)}</p>
			</div>
			<div>
				<img
					className="w-full h-auto"
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

