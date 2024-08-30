'use client';
import { ReactNode, useState, createContext, useContext, Dispatch, SetStateAction } from 'react'
import { Confirm } from "@/components/newEvent/Confirm"
import { Tickets } from '@/components/newEvent/Tickets';
import { Description } from '@/components/newEvent/Description';
import { Overview } from '@/components/newEvent/Overview';

type StepType = "Overview" | "Description" | "Tickets" | "Confirm"
interface NewEventType {
    owner:string | undefined,
    name:string | undefined,
    briefDescription:string | undefined,
    fullDescription:string | undefined,
    startsAt: number | undefined,
    endsAt: number | undefined,
    type:string | undefined,
    imageUrl:string | undefined,
}


interface newEventContextInterface {
    step: StepType,
    setStep:Dispatch<SetStateAction<StepType>> ,
    newEvent: NewEventType,
    setNewEvent: Dispatch<SetStateAction<NewEventType>>,
    isContinueEnabled:boolean,
    setIsContinueEnabled: Dispatch<SetStateAction<boolean>>,
}

export const newEventContext = createContext({} as newEventContextInterface)



export default function CreateEvent() {

    const [step, setStep] = useState<StepType>("Overview")
    const [newEvent,setNewEvent] = useState({} as NewEventType)
    const [isContinueEnabled, setIsContinueEnabled]= useState(false)

    function handleContinue() {
        console.log('Continue')
        switch (step) {
            case "Overview":
                setStep("Description")
        }
    }

    function ContinueButton() {
        return (
            <button
            className={`w-52 rounded-xl bg-slate-300 py-2 font-medium text-slate-600
                ${
                    isContinueEnabled
                      ? 'hover:bg-red-400 hover:text-white'
                      : ''
                  }
            `}
            onClick={handleContinue}
            disabled={!isContinueEnabled}
            >
                Continue
            </button>
        )
    }

    function FormContainer({children}:{children:ReactNode}) {
        return (
                <div className="w-1150px h-830px min-h- flex flex-col justify-between items-center py-10 px-16 border-2 rounded-3xl ">
                    {children}
                    <div className="w-full flex justify-between items-center">
                        <div className="w-2/6"></div>
                        <div className="flex justify-center items-center">
                            Progress Bar
                        </div>
                        <div  className="flex w-2/6 justify-end">
                            <ContinueButton/>
                        </div>
                    </div>
                </div>
        )
    }


    function renderSwitch(step:string) {
        switch(step) {
            case "Overview":
                return <Overview />
            case "Description":
                return <Description />
            case "Tickets":
                return <Tickets />
            case "Confirm":
                return <Confirm />
            default:
                return <p>Unkown step: {step}</p>

        }
    }

    return (
        <div className="flex justify-center items-center">
            <newEventContext.Provider value={{step, setStep, newEvent, setNewEvent,isContinueEnabled, setIsContinueEnabled}}>
                <FormContainer> 
                    {renderSwitch(step)}
                </FormContainer> 
            </newEventContext.Provider>
        </div>
            )

}