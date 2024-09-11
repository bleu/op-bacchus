import type { ReactNode } from "react";
import { clsx } from "clsx";

function ContinueButton({
  isContinueEnabled,
  handleContinue,
}: {
  isContinueEnabled: boolean;
  handleContinue: () => void;
}) {
  return (
    <button
      className={clsx(
        "w-52 rounded-xl bg-slate-300 py-2 font-medium text-slate-600",
        { isContinueEnabled: "hover:bg-red-400 hover:text-white" }
      )}
      onClick={handleContinue}
      disabled={!isContinueEnabled}
    >
      Continue
    </button>
  );
}

export function FormContainer({
  isContinueEnabled,
  handleContinue,
  children,
}: {
  isContinueEnabled: boolean;
  handleContinue: () => void;
  children: ReactNode;
}) {
  return (
    <div className="w-1150px h-830px min-h- flex flex-col justify-between items-center py-10 px-16 border-2 rounded-3xl ">
      {children}
      <div className="w-full flex justify-between items-center">
        <div className="w-2/6"></div>
        <div className="flex justify-center items-center">Progress Bar</div>
        <div className="flex w-2/6 justify-end">
          <ContinueButton
            isContinueEnabled={isContinueEnabled}
            handleContinue={handleContinue}
          />
        </div>
      </div>
    </div>
  );
}
