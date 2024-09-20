import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import type { Event } from "@/hooks/useCreateEventAttestation";
import clsx from "clsx";
import { CheckIcon, CopyIcon } from "lucide-react";
import QRCode from "react-qr-code";

export type TicketInfoType =
  | {
      id: string;
      recipient: string;
      revoked: boolean;
      [key: string]: any;
    }
  | undefined;

const ButtonCopyToClipBoard = ({
  contentToCopy,
  buttonText,
  className,
}: {
  contentToCopy: string;
  buttonText: string;
  className: string;
}) => {
  const { copied, copyToClipboard } = useCopyToClipboard({
    copiedEffectTimeMs: 2000,
  });
  return (
    <button
      onClick={() => copyToClipboard(contentToCopy)}
      className={className}
    >
      {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
      {buttonText}
    </button>
  );
};

const TruncateAndCopyText = ({
  text,
  className,
  maxWidth = 200,
}: {
  text: string;
  maxWidth: number;
  className?: string;
}) => {
  return (
    <div className="flex items-center space-x-2">
      <p
        className={clsx(
          "overflow-hidden text-ellipsis whitespace-nowrap",
          className,
        )}
        style={{ maxWidth: `${maxWidth}px` }}
        title={text}
      >
        {text}
      </p>
      <ButtonCopyToClipBoard
        className="p-1 rounded hover:bg-gray-200 focus:outline-none"
        contentToCopy={text}
        buttonText=""
      />
    </div>
  );
};

function formatTimestamp(timestamp: number): { time: string; date: string } {
  const date = new Date(timestamp);

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
    <div className="flex items-start justify-start w-full max-w-[1000px] border-2 rounded-3xl p-8 mt-8">
      <QRCode className="w-48 h-48 flex-none" value={eventData?.access || ""} />
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
          <ButtonCopyToClipBoard
            className="flex justify-center items-center gap-2 bg-gray-600 rounded-xl mt-5 px-16 py-2 text-white hover:bg-gray-800"
            contentToCopy={eventData?.access || ""}
            buttonText="Copy access to clipboard"
          />
        </div>
      </div>
    </div>
  );
};
