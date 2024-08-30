import {useForm} from "react-hook-form"
import { z, ZodType } from "zod"; // Add new import
import { FieldError, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useState } from "react";
import { newEventContext } from "@/app/events/new/page";

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

const TypeSelect = ({ onChange }: {onChange:any}) => {
    const [selectedType, setSelectedType] = useState('online');
  
    const options = [
      { value: 'online', label: 'Online' },
      { value: 'inPerson', label: 'In person' },
    ] as {
        value: 'online' | 'inPerson',
        label: 'Online' | 'In Person'
    }[];

    const ONLINE_TEXT = "Select this option if your event will be held online. Provide the access link or instructions at event description in the next step."
    const IN_PERSON_TEXT = "Select this option if your event will take place in person. Include location details at event description in the next step."
  
    const handleSelect = (value:'online' | 'inPerson') => {
      setSelectedType(value);
      onChange(value);
    };
  
    return (
      <div className="mb-16 space-y-2">
        <strong className="block">Type</strong>
        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`
                flex flex-col items-start p-4 rounded-lg border-2 transition-all duration-200 ease-in-out
                ${
                  selectedType === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }
              `}
            >
              <div className="font-semibold text-lg">{option.label}</div>
              <div className="text-left text-sm text-gray-500">
                {option.value === 'online' ? ONLINE_TEXT : IN_PERSON_TEXT}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

export function Overview() {

    const {isContinueEnabled, setIsContinueEnabled} = useContext(newEventContext)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
      } = useForm<FormData>({
        resolver: zodResolver(UserSchema), // Apply the zodResolver
      });

    function submitForm() {
        console.log('Sucesso!')
    }

    const handleTypeChange = (value:React.FormEvent<HTMLInputElement>) => {
        console.log('Selected type:', value);
        // Update your form state here
      };

    const eventName = watch("eventName")
    const startsAt = watch("startsAt")
    const startsAtTime = watch("startsAtTime")
    const endsAt = watch("endsAt")
    const endsAtTime = watch("endsAtTime")
    const imageUrl = watch("imageUrl")

    if (eventName && startsAt && startsAtTime && endsAt && endsAtTime && imageUrl && (!isContinueEnabled)) {
        setIsContinueEnabled(true)
    }
    if ((!(eventName && startsAt && startsAtTime && endsAt && endsAtTime && imageUrl)) && isContinueEnabled) {
        setIsContinueEnabled(true)
    }



    return (
        <>
        <form
        className="block w-full"
        onSubmit={handleSubmit(submitForm)}
        >
            <h2 className="text-4xl text-bold mb-16">
                + Create New Event
            </h2>
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
            <TypeSelect onChange={handleTypeChange}/>
            <FormField
            className="w-500px h-12 mt-1 pl-2 border-2 rounded-lg"
            label="Image URL"
            type="text"
            placeholder="Image URL"
            name="imageUrl"
            register={register}
            error={errors.imageUrl}
            />
        </form>
        
        </>
    )
}

