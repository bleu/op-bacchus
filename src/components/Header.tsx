"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import type { ReactNode } from "react";
import { CreateEventSchemaButton } from "./CreateEventSchemaButton";

const NavItem = ({ href, children }: { href: string; children: ReactNode }) => (
	<Link href={href}>
		<div className="w-24 h-16 border-b-2 flex justify-center items-center hover:border-b-4 hover:border-black">
			{children}
		</div>
	</Link>
);

const navigationLinks = [
	{ href: "/", label: "Home" },
	{ href: "/events/new", label: "Events" },
	{ href: "/tickets", label: "Tickets" },
];

export function Header() {
	return (
		<div className="flex justify-between items-center p-10 h-36">
			<div className="flex justify-start items-center w-2/6">
				<>Bacchus Logo</>
			</div>
			<nav className="flex">
				{navigationLinks.map((link) => (
					<NavItem key={link.href} href={link.href}>
						{link.label}
					</NavItem>
				))}
			</nav>
			<div className="flex w-2/6 h-10 justify-end">
				<CreateEventSchemaButton />
				<ConnectButton />
			</div>
		</div>
	);
}
