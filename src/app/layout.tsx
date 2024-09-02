import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { cookieToInitialState } from "wagmi";

import { Header } from "@/components/Header";
import { getConfig } from "../wagmi";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Bacchus",
	description: "Events and tickets",
};

export default function RootLayout(props: { children: ReactNode }) {
	const initialState = cookieToInitialState(
		getConfig(),
		headers().get("cookie"),
	);
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers initialState={initialState}>
					<div>
						<Header />
						{props.children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
