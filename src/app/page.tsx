"use client"
import { CreateTicketAttestationButton } from "@/components/CreateTicketAttestationButton";
import { CreateTicketSchemaButton } from "@/components/CreateTicketSchemaButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Bacchus Onboarding</h1>
      <CreateTicketSchemaButton />
      <CreateTicketAttestationButton />
    </main>
  );
}
