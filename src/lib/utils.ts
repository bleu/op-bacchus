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
