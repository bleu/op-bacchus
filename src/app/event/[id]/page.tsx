import {
  AssignTicketButton,
  EventInfoContainer,
  StatusFlag,
  Ticket,
  TicketInfoContainer,
  TicketInfoHeaderContainer,
} from "../components";

const ticketAddresses = [
  { address: "0xkamscknsadkcnaksdncjsdncsjdn" },
  { address: "0xkamscknsadkcnaksdncjsdncsjab" },
  { address: "0xkamscknsadkcnaksdncjsdncsjac" },
];

export default function Page({ params }: { params: { id: string } }) {
  return (
    <main className="flex flex-col items-center justify-center">
      <EventInfoContainer>
        <StatusFlag />
        <h1 className="text-4xl font-bold mb-4">Event Name</h1>
        <p className="mb-4">26, August, 2024 at 11AM</p>
        <p>Brief Description </p>
      </EventInfoContainer>
      <TicketInfoContainer>
        <TicketInfoHeaderContainer>
          <strong>Assigned Tickets</strong>
          <AssignTicketButton />
        </TicketInfoHeaderContainer>
        <div className="block mt-4">
          {ticketAddresses.map((ticket) => {
            return <Ticket key={ticket.address} address={ticket.address} />;
          })}
        </div>
      </TicketInfoContainer>
    </main>
  );
}
