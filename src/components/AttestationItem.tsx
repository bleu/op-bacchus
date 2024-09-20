import { parseEventsData } from "@/app/events/parseEventsData";
import { epochToCustomDate } from "@/lib/utils";
import Link from "next/link";

const BackupImage = "https://via.placeholder.com/300x200";

export function AttestationItem({ id, data }: { id: string; data: any }) {
  const parsedData = parseEventsData(data);

  return (
    <Link
      href={`/event/${id}`}
      className="border-2 rounded-lg w-60 hover:border-slate-600 flex flex-col overflow-hidden"
    >
      <div className="p-3">
        <h1 className="text-base font-bold truncate">{parsedData.name}</h1>
        <h2 className="text-xs">{epochToCustomDate(parsedData.startsAt)}</h2>
      </div>
      <div className="w-full h-40 overflow-hidden">
        <img
          className="w-full h-full object-cover"
          alt={parsedData.name || "Event image"}
          src={parsedData.imageUrl || BackupImage}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = BackupImage;
          }}
        />
      </div>
      <div className="p-3 flex-grow">
        <h2 className="text-xs text-gray-700 mb-2 line-clamp-2">
          Brief description: {parsedData.briefDescription}
        </h2>
        <h2 className="text-xs text-gray-700 line-clamp-2">
          Full description: {parsedData.fullDescription}
        </h2>
      </div>
    </Link>
  );
}
