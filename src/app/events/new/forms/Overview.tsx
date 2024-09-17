import { useContext, useState } from "react";
import { FormContainer } from "../components/FormContainer";
import { FormField } from "../components/FormField";
import { useForm } from "react-hook-form";
import { z, type ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewEventContext } from "@/contexts/event";

export interface OverviewFormData {
  eventName: string;
  startsAt: string;
  startsAtTime: string;
  endsAt: string;
  endsAtTime: string;
  type: string;
  imageUrl: string;
}

const UserSchema: ZodType<OverviewFormData> = z.object({
  eventName: z.string(),
  startsAt: z.string(),
  startsAtTime: z.string(),
  endsAt: z.string(),
  endsAtTime: z.string(),
  type: z.string(),
  imageUrl: z.string(),
});

function dateTimeToTimestamp(dateString: string, timeString: string): number {
  const dateTimeString = `${dateString}T${timeString}`;
  const date = new Date(dateTimeString);
  return date.getTime();
}

const TypeSelect = ({
  onChange,
}: {
  onChange: (value: "online" | "inPerson") => void;
}) => {
  const [selectedType, setSelectedType] = useState("online");

  const options = [
    { value: "online", label: "Online" },
    { value: "inPerson", label: "In person" },
  ] as {
    value: "online" | "inPerson";
    label: "Online" | "In Person";
  }[];

  const ONLINE_TEXT =
    "Select this option if your event will be held online. Provide the access link or instructions at event description in the next step.";
  const IN_PERSON_TEXT =
    "Select this option if your event will take place in person. Include location details at event description in the next step.";

  const handleSelect = (value: "online" | "inPerson") => {
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
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:border-gray-400"
                }
              `}
          >
            <div className="font-semibold text-lg">{option.label}</div>
            <div className="text-left text-sm text-gray-500">
              {option.value === "online" ? ONLINE_TEXT : IN_PERSON_TEXT}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export function Overview() {
  const { handleContinue, updateEvent } = useContext(NewEventContext);
  const [eventType, setEventType] = useState<"online" | "inPerson">("online");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<OverviewFormData>({
    resolver: zodResolver(UserSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const submitForm = () => {
    const { eventName, startsAt, startsAtTime, endsAt, endsAtTime, imageUrl } =
      getValues();
    updateEvent({
      name: eventName,
      startsAt: dateTimeToTimestamp(startsAt, startsAtTime),
      endsAt: dateTimeToTimestamp(endsAt, endsAtTime),
      type: eventType,
      imageUrl: imageUrl,
    });

    handleContinue(getValues());
  };

  const handleTypeChange = (value: "online" | "inPerson") => {
    console.log("Selected type:", value);
    setEventType(value);
  };

  return (
    <FormContainer isContinueEnabled={true} handleContinue={submitForm}>
      <form className="block w-full" onSubmit={handleSubmit(submitForm)}>
        <h2 className="text-4xl text-bold mb-16">+ Create New Event</h2>
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
        <TypeSelect onChange={handleTypeChange} />
        <FormField
          className="w-500px h-12 mt-1 pl-2 border-2 rounded-lg"
          label="Image URL"
          type="text"
          placeholder="Image URL"
          description="Preferably landscape orientation images"
          name="imageUrl"
          register={register}
          error={errors.imageUrl}
        />
      </form>
    </FormContainer>
  );
}
