import { useState } from "react";
import { Address, isAddress, zeroAddress } from "viem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTicketForm, type TicketFormData } from "./hooks/useTicketForm";

import { useCreateTicketMultiAttestations } from "@/hooks/useCreateTicketMultiAttestations";

import {
  AssignTicketText,
  CloseDialogButton,
  TriggerDialogButton,
} from "./components/ModalComponents";

export function Modal({ eventId }: { eventId: string }) {
  const [open, setOpen] = useState(false);
  const createTicketMultiAttestations = useCreateTicketMultiAttestations();

  const {
    register,
    fields,
    errors,
    isValid,
    handleSubmit,
    handleNumberOfFields,
  } = useTicketForm();

  function submitForm(data: TicketFormData) {
    const nonEmptyAddresses = data.addresses.filter(
      (element) => element.address !== ""
    );
    console.log("Form submitted with data:", nonEmptyAddresses);
    setOpen(false);

    const tickets = nonEmptyAddresses.map((element) => {
      return {
        owner: element.address as Address,
        eventId: eventId,
      };
    });

    console.log("Attesting tickets", tickets);

    createTicketMultiAttestations({ tickets: tickets });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TriggerDialogButton />
      </DialogTrigger>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>
            <AssignTicketText />
          </DialogTitle>
          <DialogDescription className="m-0">
            <br />
            <strong className="text-black">Attendee</strong>
            <br />
            <br />
            <p className="text-slate-800 text-base">
              Paste attendee{"'"}s wallet address
            </p>
            <br />
            <form onSubmit={handleSubmit(submitForm)}>
              {fields.map((field, index) => (
                <div key={field.id}>
                  <input
                    type="text"
                    placeholder="0xabc..."
                    aria-label="wallet address"
                    className="p-3 rounded-lg bg-slate-200 mb-1 w-[500px] text-slate-700 text-lg"
                    {...register(`addresses.${index}.address`, {
                      validate: (value) => {
                        if (value === "") return true;
                        return isAddress(value) || "Invalid Ethereum address";
                      },
                      onChange: handleNumberOfFields,
                    })}
                  />
                  {errors.addresses?.[index]?.address && (
                    <p className="text-red-500 text-sm mb-3">
                      {errors.addresses[index]?.address?.message}
                    </p>
                  )}
                </div>
              ))}
              <div className="flex justify-center space-x-2 mt-4">
                <CloseDialogButton isValid={isValid} />
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
