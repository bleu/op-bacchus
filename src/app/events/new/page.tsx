"use client";
import { Confirm } from "./forms/Confirm";
import { Description } from "./forms/Description";
import { Overview } from "./forms/Overview";
import { Tickets } from "./forms/Tickets";
import {
  type ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useCreateEventAttestation } from "@/hooks/useCreateEventAttestation";
import type { Event } from "@/hooks/useCreateEventAttestation";
import { useAccount } from "wagmi";

type StepType = "Overview" | "Description" | "Tickets" | "Confirm";
interface NewEventType {
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
  handleContinue: () => void;
  updateEvent: (updateEventValues: Partial<NewEventType>) => void;
}

export const NewEventContext = createContext({} as NewEventContextInterface);

export default function CreateEvent() {
  const [step, setStep] = useState<StepType>("Overview");
  const [newEvent, setNewEvent] = useState({} as NewEventType);
  const createEventAttestation = useCreateEventAttestation();
  const { address } = useAccount();

  const updateEvent = (updateEventValues: Partial<NewEventType>) => {
    return new Promise<void>((resolve) => {
      setNewEvent({ ...newEvent, ...updateEventValues });
      setTimeout(() => resolve(), 0);
    });
  };

  const stepComponents: { [key in StepType]: ReactNode } = {
    Overview: <Overview />,
    Description: <Description />,
    Tickets: <Tickets />,
    Confirm: <Confirm />,
  };

  const nextStepMapping: { [key in StepType]: StepType } = {
    Overview: "Description",
    Description: "Overview",
    Tickets: "Overview",
    Confirm: "Overview",
  };

  function handleContinue() {
    setStep(nextStepMapping[step]);
    if (step === "Description") {
      const newEventToAttest = {
        event: {
          ...newEvent,
          owner: address,
        } as Event,
      };
      createEventAttestation(newEventToAttest);
    }
  }

  function renderStep(step: StepType) {
    return stepComponents[step] || <p>Unknown step: {step}</p>;
  }

  return (
    <div className="flex justify-center items-center">
      <NewEventContext.Provider
        value={{
          handleContinue,
          updateEvent,
        }}
      >
        {renderStep(step)}
      </NewEventContext.Provider>
    </div>
  );
}
