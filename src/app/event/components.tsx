import type { ReactNode } from "react";
import { MaterialSymbol } from "react-material-symbols";

export const EventInfoContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full block p-8 border-2 rounded-3xl">{children}</div>
  );
};

export const StatusFlag = () => {
  return (
    <div className="flex w-fit justify-center items-center gap-2 bg-slate-200 py-1 px-3 rounded-lg mb-4">
      <div className="w-3 h-3 rounded-md bg-[#B2CC99]"></div>
      <span>Published</span>
    </div>
  );
};

export const TicketInfoContainer = ({ children }: { children: ReactNode }) => {
  return <div className="w-full p-8 border-2 rounded-3xl">{children}</div>;
};

export const TicketInfoHeaderContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between w-full border-b-2 pb-2">
      {children}
    </div>
  );
};

export const AssignTicketButton = () => {
  return (
    <button className="flex justify-center items-center bg-red-600 text-white rounded-xl px-3 py-3 gap-2 hover:bg-red-800">
      <MaterialSymbol icon="assignment_ind" size={20} />
      <span className="text-sm">Assign Ticket</span>
    </button>
  );
};

export const Ticket = ({ address }: { address: string }) => {
  return (
    <p className="p-3 rounded-lg bg-slate-200 my-4 w-[600px] text-lg text-slate-700">
      {address}
    </p>
  );
};
