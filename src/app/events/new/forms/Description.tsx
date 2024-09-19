import { type ReactNode, useContext, useState } from "react";

import { NewEventContext } from "@/contexts/event";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type ZodType, z } from "zod";
import { FormContainer } from "../components/FormContainer";
import { FormField } from "../components/FormField";

export interface DescriptionFormData {
  briefDescription: string;
  fullDescription: string;
  access: string;
}

const UserSchema: ZodType<DescriptionFormData> = z.object({
  briefDescription: z.string(),
  fullDescription: z.string(),
  access: z.string(),
});

export function Description() {
  const { handleContinue, updateEvent } = useContext(NewEventContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<DescriptionFormData>({
    resolver: zodResolver(UserSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const submitForm = () => {
    const { briefDescription, fullDescription } = getValues();
    updateEvent({
      briefDescription: briefDescription,
      fullDescription: fullDescription,
    });
    handleContinue(getValues());
  };

  return (
    <FormContainer isContinueEnabled={true} handleContinue={submitForm} step={2}>
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
        <div className="flex flex-col w-fit mb-16">
          <strong className="w-fit">Detailed Description</strong>
          <textarea
            className="w-1000px h-48 mt-1 pl-2 border-2 rounded-lg"
            placeholder="Enter all relevant event details here (e.g., schedule, location details, special guests, key topics)."
            {...register("fullDescription")}
          />
          {errors.fullDescription && (
            <span className="error-message">
              {errors.fullDescription as ReactNode}
            </span>
          )}
        </div>
        <FormField
          className="w-1000px h-12 mt-1 pl-2 border-2 rounded-lg"
          label="Access information"
          type="text"
          placeholder="Place information people will need to access the event (meeting link, QR code address, etc.)"
          name="access"
          register={register}
          error={errors.access}
        />
      </form>
    </FormContainer>
  );
}
