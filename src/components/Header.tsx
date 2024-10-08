"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const NavItem = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href}>
    <div className="w-24 h-16 border-b-2 flex justify-center items-center hover:border-b-4 hover:border-black">
      {children}
    </div>
  </Link>
);

export function Header() {
  return (
    <div className="flex-col md:flex-row flex md:justify-between items-center p-10 h-36">
      <div className="flex-1">
        <Image
          alt="Bacchus logo"
          src="/logo.svg"
          width={100}
          height={16}
          className="flex justify-start items-center"
        />
      </div>
      <nav className="flex">
        <NavItem href={"/"}>Home</NavItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-24 h-16 border-b-2 flex justify-center items-center hover:border-b-4 hover:border-black cursor-pointer">
              Events
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href={"/events"}>My Events</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={"/events/new"}>New Event</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
      <div className="flex flex-1 h-10 justify-center md:justify-end">
        <ConnectButton />
      </div>
    </div>
  );
}
