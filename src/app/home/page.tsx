"use client";

import Image from "next/image";


export default function Home() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1 className= "text-5xl font-bold mb-6">Explore Your Next Event</h1>
        <form action="">
            <input className="w-500px h-12 mt-1 pl-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500" placeholder = "Search" type="text"/> 
        </form>
        <div className="grid grid-cols-3 gap-12 mt-10">
        {
        [1, 2, 3, 4, 5, 6].map((event) => (
            <div className="border-2 rounded-lg w-60">
                <div className="p-3">
                <h1 className="text-base font-bold">Event #{event}</h1> 
                <h2 className="text-xs">Aug. 25th of 2024</h2>
                </div>
                <div>
                <img className = "w-full h-auto" alt="Template image" src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"/>
                </div>
                <div className="p-3">
                <h2 className="text-xs text-gray-700 mb-4">Brief description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget bibendum purus.</h2>
                <h3 className="text-xs bg-gray-100 w-fit border-4 border-transparent rounded-lg">Status: published</h3>
                </div>
            </div>
        ))
        }
        </div>

      </main>
    );
  }