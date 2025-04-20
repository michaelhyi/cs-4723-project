import { Dispatch, SetStateAction } from "react";
import FormElement from "./FormElement";

export default function Input({
    id,
    label,
    type,
    required,
    className,
    value,
    onChange,
}: {
    id: string;
    label: string;
    type: string;
    required: boolean;
    className?: string;
    value: string;
    onChange: Dispatch<SetStateAction<string>>;
}) {
    return (
        <FormElement id={id} label={label} className={className}>
            <input
                id={id}
                type={type}
                required={required}
                className="bg-[#181818] border-[#353535] border-1 rounded-md py-1 px-2 text-sm outline-none"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </FormElement>
    );
}
