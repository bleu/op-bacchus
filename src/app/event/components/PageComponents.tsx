import { useState, type ReactNode } from "react";
import { Modal } from "../Modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Event } from "@/hooks/useCreateEventAttestation";
import type { Address } from "viem";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Copy, Check } from "lucide-react";
import clsx from "clsx";

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

const TruncateAndCopyText = ({
  text,
  className,
  maxWidth = 200,
}: {
  text: string;
  maxWidth: number;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div className="flex items-center space-x-2">
      <p
        className={clsx(
          "overflow-hidden text-ellipsis whitespace-nowrap",
          className
        )}
        style={{ maxWidth: `${maxWidth}px` }}
        title={text}
      >
        {text}
      </p>
      <CopyToClipboard text={text} onCopy={handleCopy}>
        <button
          className="p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </CopyToClipboard>
    </div>
  );
};

export const OtherInfoSection = ({
  eventId,
  eventData,
  ticketAddresses,
  userIsEventOwner,
  userHasTicket,
}: {
  eventId: string;
  eventData: Event | null | undefined;
  ticketAddresses: Address[];
  userIsEventOwner: boolean;
  userHasTicket: boolean;
}) => {
  return (
    <OtherInfoContainer>
      <Tabs defaultValue="about">
        <OtherInfoHeaderContainer>
          <TabsList>
            <TabsTrigger value="about" className={tabTriggerClassName}>
              About
            </TabsTrigger>
            {userIsEventOwner ? (
              <TabsTrigger value="tickets" className={tabTriggerClassName}>
                Tickets
              </TabsTrigger>
            ) : undefined}
            {userHasTicket ? (
              <TabsTrigger value="myTicket" className={tabTriggerClassName}>
                My Ticket
              </TabsTrigger>
            ) : undefined}
          </TabsList>
          <Modal eventId={eventId} />
        </OtherInfoHeaderContainer>
        <TabsContent value="about">
          <span>Description</span>: {eventData!.fullDescription}
        </TabsContent>
        <TabsContent value="tickets">
          <div className="block mt-4">
            {ticketAddresses.map((address) => {
              return <TicketAddress key={address} address={address} />;
            })}
          </div>
        </TabsContent>
        <TabsContent value="myTicket">
          <div className="flex items-start justify-start w-full border-2 rounded-3xl p-8 mt-4">
            <div
              key="qrcode"
              className="w-48 h-48 bg-slate-600 flex-none"
            ></div>
            <div className="flex flex-col justify-center items-start w-full pr-2 pl-2 pt-0 ml-8">
              <div className="flex items-center justify-between w-full pb-4 border-b-2 border-dashed">
                <h1 className="text-2xl font-bold">Event Name</h1>
                <div className="flex flex-col items-end justify-center">
                  <p>06:30 PM</p>
                  <p>24 sep 2024</p>
                </div>
              </div>
              <div className="flex items-center justify-start gap-32 w-full mt-4">
                <div className="flex flex-col items-start justify-start">
                  <p className="text-slate-600">Ticket UID</p>
                  <TruncateAndCopyText
                    text="0xa90914762709441d557De208bAcE1edB1A3968b2"
                    maxWidth={80}
                    className="font-bold"
                  />
                </div>
                <div className="flex flex-col items-start justify-start">
                  <p className="text-slate-600">Guest{"'"}s Wallet Address</p>
                  <TruncateAndCopyText
                    text="0xa90914762709441d557De208bAcE1edB1A3968b2"
                    maxWidth={80}
                    className="font-bold"
                  />
                </div>
                <div className="flex flex-col items-start justify-start">
                  <p className="text-slate-600">Status</p>
                  <p className="font-bold">Valid</p>
                </div>
              </div>
              <div className="w-full flex items-center justify-center">
                <button className="bg-red-600 rounded-xl mt-6 px-16 py-2 text-white hover:bg-red-800">
                  View Event Access
                </button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </OtherInfoContainer>
  );
};
