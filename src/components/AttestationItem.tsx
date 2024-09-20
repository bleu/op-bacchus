import { parseEventsData } from "@/app/events/parseEventsData";
import { epochToCustomDate } from "@/lib/utils";
import Link from "next/link";

const BackupImage = "https://via.placeholder.com/150";

export function AttestationItem({ id, data }: { id: string; data: any }) {
  const parsedData = parseEventsData(data);

  return (
    <Link
      href={`/event/${id}`}
      className="border-2 rounded-lg w-60 hover:border-slate-600"
    >
      <div className="p-3">
        <h1 className="text-base font-bold">{parsedData.name}</h1>
        <h2 className="text-xs">{epochToCustomDate(parsedData.startsAt)}</h2>
      </div>
      <div>
        <img
          className="w-full h-auto"
          alt="Template image"
          src={parsedData.imageUrl}
          onError={(e) => {
            e.currentTarget.src = BackupImage;
          }}
        />
      </div>
      <div className="p-3">
        <h2 className="text-xs text-gray-700 mb-4 truncate">
          Brief description: {parsedData.briefDescription}
        </h2>
        <h2 className="text-xs text-gray-700 mb-4 truncate">
          Full description: {parsedData.fullDescription}
        </h2>
      </div>
    </Link>
  );
}
