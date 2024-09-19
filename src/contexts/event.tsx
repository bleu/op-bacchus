import type { DescriptionFormData } from "@/app/events/new/forms/Description";
import type { OverviewFormData } from "@/app/events/new/forms/Overview";
import { createContext } from "react";

export interface NewEventType {
  owner: string | undefined;
  name: string | undefined;
  briefDescription: string | undefined;
  fullDescription: string | undefined;
  startsAt: number | undefined;
  endsAt: number | undefined;
  type: "online" | "inPerson" | undefined;
  imageUrl: string | undefined;
}

interface NewEventContextInterface {
  handleContinue: (formData: OverviewFormData | DescriptionFormData) => void;
  updateEvent: (updateEventValues: Partial<NewEventType>) => void;
}

export const NewEventContext = createContext({} as NewEventContextInterface);
