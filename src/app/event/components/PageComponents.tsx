import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Event } from "@/hooks/useCreateEventAttestation";
import type { ReactNode } from "react";
import type { Address } from "viem";
import { Modal } from "../Modal";
import { type TicketInfoType, UserTicket } from "./UserTicket";

export const EventInfoContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full block p-8 border-2 rounded-3xl">{children}</div>
  );
};

export const StatusFlag = () => {
  return (
    <div className="flex w-fit justify-center items-center gap-2 bg-slate-200 py-1 px-3 rounded-lg mb-4">
      <div className="w-3 h-3 rounded-md bg-[#B2CC99]" />
      <span>Published</span>
    </div>
  );
};

const OtherInfoContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full p-8 border-2 rounded-3xl mb-96">{children}</div>
  );
};

const OtherInfoHeaderContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex items-center justify-between w-full border-b-2 pb-2">
      {children}
    </div>
  );
};

const TicketAddress = ({ address }: { address: string }) => {
  return (
    <p className="p-3 rounded-lg bg-slate-200 my-4 w-[600px] text-lg text-slate-700">
      {address}
    </p>
  );
};

const tabTriggerClassName =
  "rounded-none border-b data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-600 hover:border-red-300 hover:border-b-2";
export const OtherInfoSection = ({
  eventId,
  eventData,
  ticketAddresses,
  userIsEventOwner,
  userHasTicket,
  userTicket,
}: {
  eventId: string;
  eventData: Event | null | undefined;
  ticketAddresses: Address[];
  userIsEventOwner: boolean;
  userHasTicket: boolean;
  userTicket: TicketInfoType;
}) => {
  return (
    <OtherInfoContainer>
      <Tabs defaultValue="about">
        <OtherInfoHeaderContainer>
          <TabsList>
            <TabsTrigger value="about" className={tabTriggerClassName}>
              About
            </TabsTrigger>
            {userIsEventOwner && (
              <TabsTrigger value="tickets" className={tabTriggerClassName}>
                Tickets
              </TabsTrigger>
            )}
            {userHasTicket && (
              <TabsTrigger value="myTicket" className={tabTriggerClassName}>
                My Ticket
              </TabsTrigger>
            )}
          </TabsList>
          {userIsEventOwner && <Modal eventId={eventId} />}
        </OtherInfoHeaderContainer>
        <TabsContent value="about">
          <span>Description</span>: {eventData!.fullDescription}
        </TabsContent>
        {userIsEventOwner && (
          <TabsContent value="tickets">
            <div className="block mt-4">
              {ticketAddresses.map((address) => {
                return <TicketAddress key={address} address={address} />;
              })}
            </div>
          </TabsContent>
        )}
        {userHasTicket && (
          <TabsContent value="myTicket">
            <div className="w-full flex items-center justify-center">
              <UserTicket eventData={eventData} userTicket={userTicket} />
            </div>
          </TabsContent>
        )}
      </Tabs>
    </OtherInfoContainer>
  );
};
