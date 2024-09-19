import type { Event } from "@/hooks/useCreateEventAttestation";
import type { Address } from "viem";

interface ParsedDataItem {
  name: keyof Event;
  value: {
    value: string | { type: string; hex: string };
  };
}

export const parseEventsData = (data: string): Event => {
  const result = {} as Partial<Event>;

  try {
    const parsedData: ParsedDataItem[] = JSON.parse(data);

    if (!Array.isArray(parsedData)) {
      throw new Error("Input data is not an array after parsing");
    }

    parsedData.forEach((item) => {
      let value = item.value.value;

      // Handle BigNumber objects
      if (
        typeof value === "object" &&
        "type" in value &&
        value.type === "BigNumber"
      ) {
        value = BigInt(value.hex).toString();
      }

      // Decode URI component if it's a string (assuming URL encoding)
      if (typeof value === "string") {
        try {
          value = decodeURIComponent(value);
        } catch (e) {
          // If decoding fails, keep the original value
        }
      }

      // Type assertion based on the expected type for each property
      switch (item.name) {
        case "owner":
          result[item.name] = value as Address;
          break;
        case "startsAt":
        case "endsAt":
          result[item.name] = Number(value);
          break;
        default:
          result[item.name] = value as string;
      }
    });

    return result as Event;
  } catch (error) {
    console.error("Error parsing or processing data:", error);
    throw error;
  }
};
