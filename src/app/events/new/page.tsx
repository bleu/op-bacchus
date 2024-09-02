"use client";
import { Key } from "readline";
import { Confirm } from "@/components/newEvent/Confirm";
import { Description } from "@/components/newEvent/Description";
import { Overview } from "@/components/newEvent/Overview";
import { Tickets } from "@/components/newEvent/Tickets";
import {
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	createContext,
	useContext,
	useState,
} from "react";

type StepType = "Overview" | "Description" | "Tickets" | "Confirm";
interface NewEventType {
	owner: string | undefined;
	name: string | undefined;
	briefDescription: string | undefined;
	fullDescription: string | undefined;
	startsAt: number | undefined;
	endsAt: number | undefined;
	type: string | undefined;
	imageUrl: string | undefined;
}

interface NewEventContextInterface {
	step: StepType;
	setStep: Dispatch<SetStateAction<StepType>>;
	newEvent: NewEventType;
	setNewEvent: Dispatch<SetStateAction<NewEventType>>;
	isContinueEnabled: boolean;
	setIsContinueEnabled: Dispatch<SetStateAction<boolean>>;
}

export const NewEventContext = createContext({} as NewEventContextInterface);

function ContinueButton({
	isContinueEnabled,
	handleContinue,
}: {
	isContinueEnabled: boolean;
	handleContinue: () => void;
}) {
	return (
		<button
			className={`w-52 rounded-xl bg-slate-300 py-2 font-medium text-slate-600
            ${isContinueEnabled ? "hover:bg-red-400 hover:text-white" : ""}
        `}
			onClick={handleContinue}
			disabled={!isContinueEnabled}
		>
			Continue
		</button>
	);
}

function FormContainer({
	isContinueEnabled,
	handleContinue,
	children,
}: {
	isContinueEnabled: boolean;
	handleContinue: () => void;
	children: ReactNode;
}) {
	return (
		<div className="w-1150px h-830px min-h- flex flex-col justify-between items-center py-10 px-16 border-2 rounded-3xl ">
			{children}
			<div className="w-full flex justify-between items-center">
				<div className="w-2/6"></div>
				<div className="flex justify-center items-center">Progress Bar</div>
				<div className="flex w-2/6 justify-end">
					<ContinueButton
						isContinueEnabled={isContinueEnabled}
						handleContinue={handleContinue}
					/>
				</div>
			</div>
		</div>
	);
}

export default function CreateEvent() {
	const [step, setStep] = useState<StepType>("Overview");
	const [newEvent, setNewEvent] = useState({} as NewEventType);
	const [isContinueEnabled, setIsContinueEnabled] = useState(false);

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
		// Description: "Tickets",
		// Tickets: "Confirm",
		// Confirm: "Overview",
	};

	function handleContinue() {
		setStep(nextStepMapping[step]);
	}

	function renderStep(step: StepType) {
		return stepComponents[step] || <p>Unknown step: {step}</p>;
	}

	return (
		<div className="flex justify-center items-center">
			<NewEventContext.Provider
				value={{
					step,
					setStep,
					newEvent,
					setNewEvent,
					isContinueEnabled,
					setIsContinueEnabled,
				}}
			>
				<FormContainer
					isContinueEnabled={isContinueEnabled}
					handleContinue={handleContinue}
				>
					{renderStep(step)}
				</FormContainer>
			</NewEventContext.Provider>
		</div>
	);
}
