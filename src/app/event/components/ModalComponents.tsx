import clsx from "clsx";
import { MaterialSymbol } from "react-material-symbols";

export const AssignTicketText = () => {
  return (
    <div className="flex justify-center items-center w-fit">
      <MaterialSymbol icon="assignment_ind" size={24} />
      <span>Assign Ticket</span>
    </div>
  );
};

export const TriggerDialogButton = ({ ...props }) => {
  return (
    <button
      className=" bg-red-600 text-white rounded-xl px-3 py-3 gap-2 hover:bg-red-800"
      {...props}
    >
      <AssignTicketText />
    </button>
  );
};

export const CloseDialogButton = ({ ...props }) => {
  const isValid = props.isValid;
  return (
    <button
      type="submit"
      className={clsx(
        "rounded-xl px-40 py-3 gap-2",
        isValid
          ? "bg-red-600 text-white hover:bg-red-800"
          : "bg-slate-500 text-slate-100"
      )}
      disabled={!isValid}
      {...props}
    >
      Assign Tickets
    </button>
  );
};
