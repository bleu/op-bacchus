"use client"
import { CreateTicketSchemaButton } from "@/components/CreateTicketSchemaButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Bacchus Onboarding</h1>
      <CreateTicketSchemaButton />
    </main>
  );
}
