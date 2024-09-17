import { type ReactNode, useContext, useState } from "react";

import { FormContainer } from "../components/FormContainer";
import { FormField } from "../components/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, type ZodType } from "zod";
import { NewEventContext } from "@/contexts/event";

export interface DescriptionFormData {
  briefDescription: string;
  fullDescription: string;
}

const UserSchema: ZodType<DescriptionFormData> = z.object({
  briefDescription: z.string(),
  fullDescription: z.string(),
});

export function Description() {
  const { handleContinue, updateEvent } = useContext(NewEventContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
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
      </form>
    </FormContainer>
  );
}
