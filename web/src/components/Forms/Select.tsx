import { Dispatch, SetStateAction } from "react";
import FormElement from "./FormElement";

export default function Select({
    id,
    label,
    required,
    className,
    value,
    onChange,
    options,
}: {
    id: string;
    label: string;
    required: boolean;
    className?: string;
    value: string;
    onChange: Dispatch<SetStateAction<string>>;
    options: string[];
}) {
    return (
        <FormElement id={id} label={label} className={className}>
            <select
                id={id}
                required={required}
                className="bg-[#181818] border-[#353535] border-1 rounded-md py-1 px-2 text-sm outline-none"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            >
                <option value="" disabled>
                    Select an option
                </option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </FormElement>
    );
}
