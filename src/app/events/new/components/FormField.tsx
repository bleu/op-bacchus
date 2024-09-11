import type { FieldError, UseFormRegister } from "react-hook-form";

type ValidFieldNames =
  | "eventName"
  | "startsAt"
  | "startsAtTime"
  | "endsAt"
  | "endsAtTime"
  | "type"
  | "imageUrl"
  | "briefDescription"
  | "fullDescription";

interface FormFieldProps {
  className: string;
  label: string;
  type: string;
  placeholder: string;
  name: ValidFieldNames;
  register: UseFormRegister<any>; ///////
  error: FieldError | undefined;
  valueAsNumber?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  className,
  label,
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
}: FormFieldProps) => {
  const strongClassName =
    label === "empty" ? "w-fit text-transparent" : "w-fit";
  return (
    <div className="flex flex-col w-fit mb-16">
      <strong className={strongClassName}>{label}</strong>
      <input
        className={className}
        type={type}
        placeholder={placeholder}
        {...register(name, { valueAsNumber })}
      />
      {error && <span className="error-message">{error.message}</span>}
    </div>
  );
};
