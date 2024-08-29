'use client';
import { FormEvent, ReactNode, useState } from 'react'
import { Confirm } from "@/components/newEvent/Confirm"
import { Tickets } from '@/components/newEvent/Tickets';
import { Description } from '@/components/newEvent/Description';
import { Overview } from '@/components/newEvent/Overview';

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

function handleContinue() {

}

function ContinueButton() {
    return (
        <button
        className="w-52 rounded-xl bg-slate-200 py-2 font-medium text-slate-500"
        onClick={handleContinue}
        >
            Continue
        </button>
    )
}

export default function CreateEvent() {

    // async function onSubmit(event: FormEvent<HTMLFormElement>) {
    //     event.preventDefault()

    //     const formData = new FormData(event.currentTarget)
    //     // Convert FormData to a plain object
    //     const formValues = Object.fromEntries(formData.entries());
    //     console.log('Form Values:', formValues);

    // }

    const [step, setStep] = useState("Overview")

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
            <FormContainer> 
                {renderSwitch(step)}
            </FormContainer> 
        </div>
            )

}