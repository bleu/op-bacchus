import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MaterialSymbol } from "react-material-symbols";

const AssignTicketText = () => {
  return (
    <div className="flex justify-center items-center w-fit">
      <MaterialSymbol icon="assignment_ind" size={24} />
      <span>Assign Ticket</span>
    </div>
  );
};

const TriggerDialogButton = ({ ...props }) => {
  return (
    <button
      className=" bg-red-600 text-white rounded-xl px-3 py-3 gap-2 hover:bg-red-800"
      {...props}
    >
      <AssignTicketText />
    </button>
  );
};

const AddressInput = ({ ...props }) => {
  return (
    <input
      type="text"
      placeholder="0xabc..."
      className="p-3 rounded-lg bg-slate-200 mb-4 w-[500px] mr-16 text-slate-700 text-lg"
    />
  );
};

const CloseDialogButton = ({ ...props }) => {
  return (
    <button
      className=" bg-red-600 text-white rounded-xl px-40 py-3 gap-2 hover:bg-red-800"
      {...props}
    >
      Assign Tickets
    </button>
  );
};

export function Modal() {
  const [open, setOpen] = useState(false);

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
            <AddressInput />
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-2">
          <CloseDialogButton
            onClick={() => {
              setOpen(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
