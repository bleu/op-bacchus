"use client";
import { NewEventContext, type NewEventType } from "@/contexts/event";
import { useCreateEventAttestation } from "@/hooks/useCreateEventAttestation";
import type { Event } from "@/hooks/useCreateEventAttestation";
import { type ReactNode, createContext, useState } from "react";
import { useAccount } from "wagmi";
import { Confirm } from "./forms/Confirm";
import { Description } from "./forms/Description";
import type { DescriptionFormData } from "./forms/Description";
import { Overview } from "./forms/Overview";
import type { OverviewFormData } from "./forms/Overview";
import { Tickets } from "./forms/Tickets";

type StepType = "Overview" | "Description" | "Tickets" | "Confirm";

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

	function handleContinue(formData: OverviewFormData | DescriptionFormData) {
		setStep(nextStepMapping[step]);
		if (step === "Description") {
			const newEventToAttest = {
				event: {
					...newEvent,
					...formData,
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
