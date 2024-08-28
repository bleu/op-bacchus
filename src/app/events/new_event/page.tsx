'use client';
import { FormEvent } from 'react'


export default function CreateEvent() {

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        // Convert FormData to a plain object
        const formValues = Object.fromEntries(formData.entries());
        console.log('Form Values:', formValues);

    }

    return (
        <div> 
            <h1>Create Event</h1>
            <form onSubmit={onSubmit}>
                <input type="text" name="name" />
                <input type="text" name="address" />
                <button type="submit">Submit</button>
            </form> 
        </div>
            )

}