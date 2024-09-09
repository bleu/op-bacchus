import type { ReactNode } from "react";
import { MaterialSymbol } from "react-material-symbols";

const EventInfoContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-1150px block py-4 px-8 border-2 rounded-3xl mb-10">
      {children}
    </div>
  );
};

const StatusFlag = () => {
  return (
    <div className="flex w-fit justify-center items-center gap-2 bg-slate-200 py-1 px-3 rounded-lg mb-4">
      <div className="w-3 h-3 rounded-md bg-slate-400"></div>
      <span>Published</span>
    </div>
  );
};

const TicketInfoContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-1150px h-96 min-h- flex flex-col justify-between items-center py-4 px-8 border-2 rounded-3xl">
      {children}
    </div>
  );
};

const TicketInfoHeaderContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-between w-full border-b-2 pb-2 mb-2">
      {children}
    </div>
  );
};

const AssignTicketButton = () => {
  return (
    <button className="flex justify-center items-center bg-red-600 text-white rounded-xl px-3 py-3 gap-2 hover:bg-red-800">
      <MaterialSymbol icon="assignment_ind" size={24} />
      <span>Assign Ticket</span>
    </button>
  );
};

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
      </TicketInfoContainer>
    </main>
  );
}
