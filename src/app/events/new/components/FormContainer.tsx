import { clsx } from "clsx";
import type { ReactNode } from "react";

function ContinueButton({
  isContinueEnabled,
  handleContinue,
}: {
  isContinueEnabled: boolean;
  handleContinue: () => void;
}) {
  return (
    <button
      type="button"
      className={clsx(
        "w-52 rounded-xl bg-slate-300 py-2 font-medium text-slate-600",
        { "hover:bg-red-600 hover:text-white": isContinueEnabled },
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
        <div className="w-2/6" />
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
