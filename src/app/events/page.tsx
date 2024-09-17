"use client";
import { useSigner } from "@/hooks/useSigner";
import {
	TICKET_BY_RECIPIENT_QUERY,
	USER_ATTESTATIONS_QUERY,
	GET_ATTESTATION_BY_ID_QUERY
} from "@/lib/gqlEasAttestation/query";
import { useQuery } from "urql";
import { API_URL_MAPPING } from "@/lib/gqlEasAttestation";
import { useChainId } from "wagmi";
import { useMemo, useState } from "react";
import { fromUnixTime, format, isPast } from "date-fns";
import { enUS } from "date-fns/locale";
import { parseEventsData } from "./parseEventsData";
import Link from "next/link";
import { CREATE_TICKET_SCHEMA_UID } from "@/components/CreateTicketSchemaButton";

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

export default function Events() {
	const signer = useSigner();

	const chainId = useChainId();

	const attester = signer?.address || "";

	const recipient = signer?.address || "";

	const [searchTerm, setSearchTerm] = useState("");

	const [result] = useQuery({
		query: USER_ATTESTATIONS_QUERY,
		variables: { attester, schemaId: CREATE_TICKET_SCHEMA_UID },
		context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
		pause: !signer,
	});

	const { data, fetching, error } = result;

	const filteredAttestations = useMemo(() => {
		if (!data?.attestations) return [];
		return data.attestations.filter((attestation) => {
			const parsedData = parseEventsData(attestation.decodedDataJson);
			const searchableText =
				`${parsedData.name} ${parsedData.briefDescription}`.toLowerCase();
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

	console.log(attestationList)

	const [ticketsResult] = useQuery({
		query: TICKET_BY_RECIPIENT_QUERY,
		variables: { recipient, schemaId: CREATE_TICKET_SCHEMA_UID },
		context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
		pause: !signer,
	});

	const {
		data: ticketsData,
		fetching: ticketsFetching,
		error: ticketsError,
	} = ticketsResult;

	// const ticketList = useMemo(
	// 	() =>
	// 		ticketsData?.attestations?.map((ticket) => {
	// 			return <TicketItem key={ticket.id} ticket={ticket} />;
	// 		}) || [],
	// 	[ticketsData?.attestations],
	// );

	  const { processedInvitations, invitationIdentifiers } = useMemo(() => {
		if (!ticketsData || !ticketsData.attestations) {
		  return { processedInvitations: null, invitationIdentifiers: [] };
		}
	
		const validInvitations = ticketsData.attestations.filter(
		  invitation => 
			invitation !== undefined && 
			invitation !== null &&
			invitation.id !== undefined &&
			invitation.id !== null &&
			invitation.id !== ''
		);
	
		const invitationIdentifiers = validInvitations.map(invitation => invitation.id);
	
		return {
		  processedInvitations: validInvitations.length > 0 ? { attestations: validInvitations } : null,
		  invitationIdentifiers
		};
	  }, [ticketsData]);


	  const [ticket_events_result] = useQuery({
		query: GET_ATTESTATION_BY_ID_QUERY,
		variables: { ids:  invitationIdentifiers},
		context: useMemo(() => ({ url: API_URL_MAPPING[chainId] }), [chainId]),
		pause: !signer,
	});

	const {
		data: tickets_Data,
		fetching: tickets_Fetching,
		error: tickets_Error,
	} = ticket_events_result;

	const filteredTickets = useMemo(() => {
		if (!tickets_Data?.attestations) return [];
		return tickets_Data.attestations.filter((ticket) => {
		  const parsedData = parseEventsData(ticket.decodedDataJson);
		  const searchableText =
			`${parsedData.name} ${parsedData.briefDescription}`.toLowerCase();
		  return searchableText.includes(searchTerm.toLowerCase());
		});
	  }, [tickets_Data?.attestations, searchTerm]);
	
	  const ticket_List = useMemo(
		() =>
		  filteredTickets.map((ticket) => (
			<EventItem
			  key={ticket.id}
			  data={ticket.decodedDataJson}
			/>
		  )),
		[filteredTickets],
	  );

	  console.log(ticket_List)

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};

	if (!signer) {
		return <div>Connect a wallet to view your attestations.</div>;
	}

	if (!ticket_List) {
		return <div>Loading attestation data...</div>;
	}

	if (!data) {
		return <div>Loading attestation data...</div>;
	}

	return (
		<div className="px-4 sm:px-12">
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
					className="w-[70%] h-12 pl-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
					placeholder="Search"
					type="text"
					value={searchTerm}
					onChange={handleSearch}
				/>
				<select className="w-[30%] h-12 pl-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500">
					<option value="">All status</option>
					<option value="Published">Published</option>
					<option value="Finished">Finished</option>
				</select>
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

			<div className="mb-3">
				<div className="flex items-center justify-between mt-6 mb-1">
					<h1 className="text-base font-bold">Invitations</h1>
				</div>
				<hr className="border-t border-gray-300 w-full mb-8" />
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-y-12">
			{ticket_List.length > 0 ? (
					attestationList
				) : (
					<div className="col-span-full text-center text-gray-500">
						You have not been invited to any events.
					</div>
				)}
			</div>
		</div>
	);
}

function AttestationItem({ data }: { data: any }) {
	const parsedData = parseEventsData(data);
	const eventDate = new Date(parsedData.startsAt);
	const isEventPast = isPast(eventDate);
	const statusText = isEventPast ? "Finished" : "Published";
	const statusColor = isEventPast
		? "bg-red-100 text-red-800"
		: "bg-green-100 text-green-800";

	return (
		<div
			key="Event"
			className="border-2 rounded-lg w-60 h-45 gap-6 justify-self-center"
		>
			<div className="p-3">
				<h2 className="text-base font-bold">{parsedData.name || "Unnamed Event"}</h2>
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
				<span
					className={`text-xs px-2 py-1 rounded-lg inline-block ${statusColor}`}
				>
					{statusText}
				</span>
			</div>
		</div>
	);
}

function EventItem({ ticket }: { ticket: any }) {

	const parsedData = parseEventsData(ticket);
	const eventDate = new Date(parsedData.startsAt);
	const isEventPast = isPast(eventDate);
	const statusText = isEventPast ? "Finished" : "Published";
	const statusColor = isEventPast
		? "bg-red-100 text-red-800"
		: "bg-green-100 text-green-800";

	return (
		<div
			key="Ticket"
			className="border-2 rounded-lg w-60 h-45 gap-6 justify-self-center"
		>
			<div className="p-3">
				<h2 className="text-base font-bold">
					{parsedData.name || "Unnamed Event"}
				</h2>
				<p className="text-xs">{epochToCustomDate(parsedData.startsAt)}</p>
			</div>
			<div>
				<img
					className="w-full h-auto"
					alt="Event image"
					src={parsedData.imageUrl || "/placeholder-image.jpg"}
				/>
			</div>
			<div className="p-3">
				<p className="text-xs text-gray-700 mb-4">
					Brief description:{" "}
					{parsedData.briefDescription}
				</p>
				<span
					className={`text-xs px-2 py-1 rounded-lg inline-block ${statusColor}`}
				>
					{statusText}
				</span>
			</div>
		</div>
	);
}
