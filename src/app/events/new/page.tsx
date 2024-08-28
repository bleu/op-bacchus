'use client';
import { FormEvent, useState } from 'react'
import { Confirm } from "@/components/newEvent/Confirm"
import { Tickets } from '@/components/newEvent/Tickets';
import { Description } from '@/components/newEvent/Description';
import { Overview } from '@/components/newEvent/Overview';
import { render } from 'react-dom';

export default function CreateEvent() {

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        // Convert FormData to a plain object
        const formValues = Object.fromEntries(formData.entries());
        console.log('Form Values:', formValues);

    }

    const [step, setStep] = useState("Description")

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
            {/* <h1>Create Event</h1>
            <form onSubmit={onSubmit}>
                <input type="text" name="name" />
                <input type="text" name="address" />
                <button type="submit">Submit</button>
            </form>  */}
            {renderSwitch(step)} 
        </div>
            )

}