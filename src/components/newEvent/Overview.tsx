import {useForm} from "react-hook-form"
import { z, ZodType } from "zod"; // Add new import
import { FieldError, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormData {
    eventName: string;
    startsAt: string;
    startsAtTime: string;
    endsAt: string;
    endsAtTime: string;
    type: string;
    imageUrl: string;
  };

interface FormFieldProps {
    className: string;
    label:string;
    type: string;
    placeholder: string;
    name: ValidFieldNames;
    register: UseFormRegister<FormData>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
  };


type ValidFieldNames =
  | "eventName"
  | "startsAt"
  | "startsAtTime"
  | "endsAt"
  | "endsAtTime"
  | "type"
  | "imageUrl";


const FormField: React.FC<FormFieldProps> = ({
  className,
  label,
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
}) => {
    const strongClassName = (label=="empty") ? "w-fit text-transparent" : "w-fit"
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
)};

const UserSchema: ZodType<FormData> = z
 .object({
    eventName: z
        .string()
        .max(10),
    startsAt: z
        .string()
        .date(),
    startsAtTime: z
        .string()
        .time(),
    endsAt: z
        .string(),
    endsAtTime: z
        .string()
        .time(),
    type: z
        .string(),
    imageUrl: z.string(),
});

export function Overview() {

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
      } = useForm<FormData>({
        resolver: zodResolver(UserSchema), // Apply the zodResolver
      });

    function submitForm() {
        console.log('Sucesso!')
    }


    return (
        <>
        <form
        className="block w-full"
        onSubmit={handleSubmit(submitForm)}
        >
            <div className="flex items-center justify-between">
                <FormField
                className="w-500px h-12 mt-1 pl-2 border-2 rounded-lg"
                label="Event Name"
                type="text"
                placeholder="Text"
                name="eventName"
                register={register}
                error={errors.eventName}
                />
                <div className="flex items-center justify-between w-56 ">
                    <FormField
                    className="w-32 h-10 mt-1 pl-2 bg-slate-100 rounded-lg"
                    label="Starts at"
                    type="date"
                    placeholder=""
                    name="startsAt"
                    register={register}
                    error={errors.startsAt}
                    />
                    <FormField
                    className="w-20 h-10 mt-1 pl-2 bg-slate-100 rounded-lg"
                    label="empty"
                    type="time"
                    placeholder=""
                    name="startsAtTime"
                    register={register}
                    error={errors.startsAtTime}
                    />
                </div>
                <div className="flex items-center justify-between w-56">
                    <FormField
                    className="w-32 h-10 mt-1 pl-2 bg-slate-100 rounded-lg"
                    label="Ends at"
                    type="date"
                    placeholder="Ends"
                    name="endsAt"
                    register={register}
                    error={errors.endsAt}
                    />
                    <FormField
                    className="w-20 h-10 mt-1 pl-2 bg-slate-100 rounded-lg"
                    label="empty"
                    type="time"
                    placeholder=""
                    name="endsAtTime"
                    register={register}
                    error={errors.endsAtTime}
                    />
                </div>
            </div>
            <FormField
            className="w-500px h-12 mt-1 pl-2 border-2 rounded-lg"
            label="Type"
            type="text"
            placeholder="Type"
            name="type"
            register={register}
            error={errors.type}
            />
            <FormField
            className="w-500px h-12 mt-1 pl-2 border-2 rounded-lg"
            label="Image URL"
            type="text"
            placeholder="Image URL"
            name="imageUrl"
            register={register}
            error={errors.imageUrl}
            />
            <button
            className="w-52 rounded-xl bg-red-400 py-2 font-medium text-slate-500"
            type="submit"
            >
                Continue
            </button>
        </form>
        
        </>
    )
}

