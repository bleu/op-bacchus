"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CreateEventSchemaButton } from './CreateEventSchemaButton';
import type {ReactNode} from "react"
import Link from 'next/link'

const NavItem = ({ href, children }: {href:string, children:ReactNode}) => (
  <Link href={href}>
    <div className="w-24 h-16 border-b-2 flex justify-center items-center hover:border-b-4 hover:border-black">
      {children}
    </div>
  </Link>
);

export function Header() {
    return (
        <div className='flex justify-between items-center p-10 h-36' >
          <div className = 'flex justify-start items-center w-2/6'>
            "Bacchus Logo"
          </div>
          <div className = 'flex'>
            <NavItem href = '/'>  Home </NavItem>
            <NavItem href = '/events/new'>  Events </NavItem>
            <NavItem href = '/tickets'>  Tickets </NavItem>
          </div>
          <div className="flex w-2/6 h-10 justify-end">
            <CreateEventSchemaButton />
            <ConnectButton />
          </div>
          
        </div>
      );
    };