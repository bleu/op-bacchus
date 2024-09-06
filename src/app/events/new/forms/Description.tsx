import { useContext, useState } from "react";
import { NewEventContext } from "../page";
import { FormContainer } from "../components/FormContainer";
import { FormField } from "../components/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodType } from "zod";

interface FormData {
  briefDescription: string;
  fullDescription: string;
}

const UserSchema: ZodType<FormData> = z.object({
  briefDescription: z.string(),
  fullDescription: z.string(),
});

export function Description() {
  const { handleContinue, updateEvent } = useContext(NewEventContext);
  const [eventType, setEventType] = useState<"online" | "inPerson">("online");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(UserSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  function submitForm() {
    const { briefDescription, fullDescription } = getValues();
    updateEvent({
      briefDescription: briefDescription,
      fullDescription: fullDescription,
    });
    handleContinue();
  }

  return (
    <FormContainer isContinueEnabled={true} handleContinue={submitForm}>
      <form className="block w-full" onSubmit={handleSubmit(submitForm)}>
        <h2 className="text-4xl text-bold mb-16">+ Create New Event</h2>
        <FormField
          className="w-1000px h-12 mt-1 pl-2 border-2 rounded-lg"
          label="Short Description"
          type="text"
          placeholder="Provide a short overview of the event..."
          name="briefDescription"
          register={register}
          error={errors.briefDescription}
        />
        <FormField
          className="text-justify w-1000px h-48 h-12 mt-1 pl-2 border-2 rounded-lg"
          label="Detailed Description"
          type="text"
          placeholder="Enter all relevant event details here (e.g., schedule, location details, special guests, key topics)."
          name="fullDescription"
          register={register}
          error={errors.fullDescription}
        />
      </form>
    </FormContainer>

    // <form className="block w-full">
    // 	<h2 className="text-4xl text-bold mb-16">+ Create New Event</h2>
    // 	<div className="flex flex-col w-fit mb-16">
    // 		<strong className="w-fit">Short Description</strong>
    // 		<input
    // 			className="w-1000px h-12 mt-1 pl-2 border-2 rounded-lg"
    // 			type="text"
    // 			placeholder="Provide a short overview of the event..."
    // 		/>
    // 	</div>
    // 	<div className="flex flex-col w-fit mb-16">
    // 		<strong className="w-fit">Detailed Description</strong>
    // 		<textarea
    // 			className="text-justify w-1000px h-48 h-12 mt-1 pl-2 border-2 rounded-lg"
    // 			// type="text"
    // 			placeholder="Enter all relevant event details here (e.g., schedule, location details, special guests, key topics)."
    // 		/>
    // 	</div>
    // </form>
  );
}
