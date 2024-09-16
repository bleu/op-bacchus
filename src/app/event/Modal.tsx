import { useState } from "react";
import { isAddress } from "viem";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFieldArray, useForm } from "react-hook-form";

import {
  AssignTicketText,
  CloseDialogButton,
  TriggerDialogButton,
} from "./components/ModalComponents";

interface FormData {
  addresses: { address: string }[];
}

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
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const watchedFields = watch("addresses");

  function submitForm(data: FormData) {
    const filteredData = data.addresses.filter(
      (element) => element.address !== ""
    );
    console.log("Form submitted with data:", filteredData);
    setOpen(false);
  }

  const handleNumberOfFields = useCallback(() => {
    const lastElement = watchedFields[watchedFields.length - 1];
    if (isAddress(lastElement?.address)) {
      append({ address: "" });
    }
    const emptyElements = watchedFields
      .map((field, index) => (field.address === "" ? index : -1))
      .filter((index) => index !== -1);
    if (emptyElements.length > 1) {
      remove(emptyElements[0]);
    }
  }, [watchedFields, append, remove]);

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
                    className="p-3 rounded-lg bg-slate-200 mb-1 w-[500px] mr-16 text-slate-700 text-lg"
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
