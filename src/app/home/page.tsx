"use client";

import Image from "next/image";


export default function Home() {
    return (

              <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-6 md:p-12 lg:p-24">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center">Explore Your Next Event</h1>
                
                <form className="w-full max-w-md">
                  <input 
                    className="w-full h-12 mt-1 pl-2 border-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500" 
                    placeholder="Search" 
                    type="text"
                  /> 
                </form>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12 mt-10 w-full max-w-6xl">
                  {[1, 2, 3, 4, 5, 6].map((event) => (
                    <div key={event} className="border-2 rounded-lg w-full">
                      <div className="p-3">
                        <h2 className="text-base font-bold">Event #{event}</h2> 
                        <p className="text-xs">Aug. 25th of 2024</p>
                      </div>
                      <div>
                        <img 
                          className="w-full h-auto" 
                          alt="Template image" 
                          src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-700 mb-4">
                          Brief description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget bibendum purus.
                        </p>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg inline-block">
                          Status: published
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </main>
    );
  }