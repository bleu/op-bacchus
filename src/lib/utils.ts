import type { DataEntry } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { format, fromUnixTime } from "date-fns";
import { enUS } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function epochToCustomDate(epoch: number): string {
  try {
    const epochInSeconds = epoch.toString().length > 10 ? epoch / 1000 : epoch;

    const date = fromUnixTime(epochInSeconds);

    return format(date, "d, MMMM 'of' yyyy", { locale: enUS });
  } catch (error) {
    return "Invalid Date";
  }
}

export function sortByStartsAt(data: DataEntry[]): DataEntry[] {
  return data.sort((a, b) => {
    const aDecoded = JSON.parse(a.decodedDataJson);
    const bDecoded = JSON.parse(b.decodedDataJson);

    const aStartsAt = aDecoded.find((item: any) => item.name === "startsAt")
      ?.value.value.hex;
    const bStartsAt = bDecoded.find((item: any) => item.name === "startsAt")
      ?.value.value.hex;

    if (!aStartsAt || !bStartsAt) return 0;

    return Number.parseInt(aStartsAt, 16) - Number.parseInt(bStartsAt, 16);
  });
}
