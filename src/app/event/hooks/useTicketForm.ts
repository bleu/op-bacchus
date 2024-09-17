import { useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { isAddress } from "viem";

export interface TicketFormData {
	addresses: { address: string }[];
}

export const useTicketForm = () => {
	const {
		register,
		control,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm<TicketFormData>({
		defaultValues: {
			addresses: [{ address: "" }],
		},
		mode: "onChange",
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "addresses",
	});

	const watchedFields = watch("addresses");

	const handleNumberOfFields = useCallback(() => {
		const lastElement = watchedFields[watchedFields.length - 1];
		if (isAddress(lastElement?.address)) {
			append({ address: "" });
		}
		const emptyElements = watchedFields
			.map((field, index) => (field.address === "" ? index : -1))
			.filter((index) => index !== -1);
		if (emptyElements.length > 1) {
			remove(emptyElements[0]);
		}
	}, [watchedFields, append, remove]);

	return {
		register,
		fields,
		errors,
		isValid,
		handleSubmit,
		handleNumberOfFields,
	};
};
