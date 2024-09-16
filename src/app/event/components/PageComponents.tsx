import type { ReactNode } from "react";
import { Modal } from "../Modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Event } from "@/hooks/useCreateEventAttestation";
import type { Address } from "viem";

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

const TicketInfoContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full p-8 border-2 rounded-3xl mb-96">{children}</div>
  );
};

const TicketInfoHeaderContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-between w-full border-b-2 pb-2">
      {children}
    </div>
  );
};

const Ticket = ({ address }: { address: string }) => {
  return (
    <p className="p-3 rounded-lg bg-slate-200 my-4 w-[600px] text-lg text-slate-700">
      {address}
    </p>
  );
};

export const TicketOwnerManagementSection = ({
  eventId,
  eventData,
  ticketAddresses,
}: {
  eventId: string;
  eventData: Event | null | undefined;
  ticketAddresses: Address[];
}) => {
  return (
    <TicketInfoContainer>
      <Tabs defaultValue="about">
        <TicketInfoHeaderContainer>
          <TabsList>
            <TabsTrigger
              value="about"
              className="rounded-none border-b data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-600"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="rounded-none border-b data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-600"
            >
              Tickets
            </TabsTrigger>
          </TabsList>
          <Modal eventId={eventId} />
        </TicketInfoHeaderContainer>
        <TabsContent value="about">
          <span>Description</span>: {eventData!.fullDescription}
        </TabsContent>
        <TabsContent value="tickets">
          <div className="block mt-4">
            {ticketAddresses.map((address) => {
              return <Ticket key={address} address={address} />;
            })}
          </div>
        </TabsContent>
      </Tabs>
    </TicketInfoContainer>
  );
};
