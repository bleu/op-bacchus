"use client"


import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CreateEventSchemaButton } from './CreateEventSchemaButton';
import Link from 'next/link'

export function Header() {
    return (
        <div className='flex justify-between p-10 h-36 bg-slate-50' >
          <div className = 'flex justify-center items-center'>
            "Bacchus Logo"
          </div>


          <div className = 'flex'>
            <Link href = '/'> <div className='w-24 h-16 border-b-2 flex justify-center items-center hover:border-b-4 hover:border-black'> Home </div></Link>
            <Link href = '/events'> <div className='w-24 h-16 border-b-2 flex justify-center items-center hover:border-b-4 hover:border-black'> Events </div></Link>
            <Link href = '/tickets'> <div className='w-24 h-16 border-b-2 flex justify-center items-center hover:border-b-4 hover:border-black'> Tickets </div></Link>
          </div>


          <div>
            <CreateEventSchemaButton />
            <ConnectButton />
          </div>
          
        </div>
      );
    };