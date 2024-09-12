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
import { useFieldArray, useForm } from "react-hook-form";
import clsx from "clsx";

interface FormData {
  addresses: { address: string }[];
}

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

const isValidEthereumAddress = (address: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export function Modal() {
  const [open, setOpen] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      addresses: [{ address: "" }],
    },
  });
  const { append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const fields = watch("addresses");

  function submitForm(data: FormData) {
    const filteredData = data.addresses.filter(
      (element) => element.address !== ""
    );
    console.log("Form submitted with data:", filteredData);
    setOpen(false);
  }

  function handleAppendNewFields() {
    const lastElement = fields[fields.length - 1];
    if (isValidEthereumAddress(lastElement?.address)) {
      append({ address: "" });
    }
  }
  function handleDeleteFields() {
    const emptyElements = fields
      .map((field, index) => {
        if (field.address === "")
          return { index: index, address: field.address };
      })
      .filter((element) => element);
    if (emptyElements.length > 1) {
      remove(emptyElements[0]?.index);
    }
  }

  function handleNumberOfFields() {
    handleAppendNewFields();
    handleDeleteFields();
  }

  function AddressInput({ index }: { index: number }) {
    return (
      <div>
        {errors.addresses?.[index]?.address && (
          <p className="text-red-500 text-sm mt-2">
            {errors.addresses[index]?.address?.message}
          </p>
        )}
        <input
          type="text"
          placeholder="0xabc..."
          className="p-3 rounded-lg bg-slate-200 mb-4 w-[500px] mr-16 text-slate-700 text-lg"
          {...register(`addresses.${index}.address`, {
            validate: (value) =>
              value === "" ||
              isValidEthereumAddress(value) ||
              "Invalid Ethereum address",
            onChange: handleNumberOfFields,
          })}
        />
      </div>
    );
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
              {fields.map((field, index) => {
                return <AddressInput key={index} index={index} />;
              })}
              <div className="flex justify-center space-x-2">
                <button
                  type="submit"
                  className={clsx(
                    " rounded-xl px-40 py-3 gap-2",
                    isValid
                      ? " bg-red-600 text-white  hover:bg-red-800"
                      : " bg-slate-500 text-slate-100"
                  )}
                  disabled={!isValid}
                >
                  Assign Tickets
                </button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
