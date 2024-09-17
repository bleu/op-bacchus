import { CopyToClipboard } from "react-copy-to-clipboard";
import { Copy, Check } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import type { Event } from "@/hooks/useCreateEventAttestation";

export type TicketInfoType =
  | {
      id: string;
      recipient: string;
      revoked: boolean;
      [key: string]: any;
    }
  | undefined;

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

function formatTimestamp(timestamp: number): { time: string; date: string } {
  const date = new Date(timestamp); // Convert seconds to milliseconds

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const timeString = date.toLocaleString("en-US", timeOptions);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" }).toLowerCase();
  const year = date.getFullYear();
  const dateString = `${day} ${month} ${year}`;

  return {
    time: timeString,
    date: dateString,
  };
}

export const UserTicket = ({
  eventData,
  userTicket,
}: {
  eventData: Event | null | undefined;
  userTicket: TicketInfoType;
}) => {
  const { date: formattedDate, time: formattedTime } = eventData
    ? formatTimestamp(eventData.startsAt)
    : { date: undefined, time: undefined };

  return (
    <div className="flex items-start justify-start w-full border-2 rounded-3xl p-8 mt-4">
      <div key="qrcode" className="w-48 h-48 bg-slate-600 flex-none"></div>
      <div className="flex flex-col justify-center items-start w-full pr-2 pl-2 pt-0 ml-8">
        <div className="flex items-center justify-between w-full pb-4 border-b-2 border-dashed">
          <h1 className="text-2xl font-bold">{eventData?.name}</h1>
          <div className="flex flex-col items-end justify-center">
            <p>{formattedTime}</p>
            <p className="text-slate-600">{formattedDate}</p>
          </div>
        </div>
        <div className="flex items-center justify-start gap-32 w-full mt-4">
          <div className="flex flex-col items-start justify-start">
            <p className="text-slate-600">Ticket UID</p>
            <TruncateAndCopyText
              text={userTicket ? userTicket.id : ""}
              maxWidth={80}
              className="font-bold"
            />
          </div>
          <div className="flex flex-col items-start justify-start">
            <p className="text-slate-600">Guest{"'"}s Wallet Address</p>
            <TruncateAndCopyText
              text={userTicket ? userTicket.recipient : ""}
              maxWidth={80}
              className="font-bold"
            />
          </div>
          <div className="flex flex-col items-start justify-start">
            <p className="text-slate-600">Status</p>
            <p className="font-bold">
              {userTicket ? (userTicket.revoked ? "Revoked" : "Valid") : ""}
            </p>
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <button className="bg-red-600 rounded-xl mt-6 px-16 py-2 text-white hover:bg-red-800">
            View Event Access
          </button>
        </div>
      </div>
    </div>
  );
};
