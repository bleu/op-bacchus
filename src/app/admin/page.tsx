"use client";

import { CreateEventAttestationButton } from "@/components/CreateEventAttestationButton";
import { CreateEventSchemaButton } from "@/components/CreateEventSchemaButton";

export default function AdminPage() {
  return (
    <div>
      <CreateEventAttestationButton />
      <CreateEventSchemaButton />
    </div>
  );
}
