export function Description() {
    
        return (
            <form
            className="block w-full"
            >
                <h2 className="text-4xl text-bold mb-16">
                    + Create New Event
                </h2>
                <div className="flex flex-col w-fit mb-16">
                    <strong className="w-fit">Short Description</strong>
                    <input
                    className="w-1000px h-12 mt-1 pl-2 border-2 rounded-lg"
                    type="text"
                    placeholder="Provide a short overview of the event..."
                    />
                </div>
                <div className="flex flex-col w-fit mb-16">
                    <strong className="w-fit">Detailed Description</strong>
                    <textarea
                    className="text-justify w-1000px h-48 h-12 mt-1 pl-2 border-2 rounded-lg"
                    // type="text"
                    placeholder="Enter all relevant event details here (e.g., schedule, location details, special guests, key topics)."
                    />
                </div>
                
            </form>
    )
}