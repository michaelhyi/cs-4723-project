import { Dispatch, SetStateAction } from "react";

export default function ProxyLogTabs({
    selected,
    setSelected,
}: {
    selected: number;
    setSelected: Dispatch<SetStateAction<number>>;
}) {
    return (
        <div className="flex items-center justify-between text-sm mt-4 gap-4 ml-10 w-1/3">
            <p
                className={`cursor-pointer ${selected === 0 ? "underline font-semibold" : "font-normal"}`}
                onClick={() => setSelected(0)}
            >
                Request Body
            </p>
            <p
                className={`cursor-pointer ${selected === 1 ? "underline font-semibold" : "font-normal"}`}
                onClick={() => setSelected(1)}
            >
                Request Headers
            </p>
            <p
                className={`cursor-pointer ${selected === 2 ? "underline font-semibold" : "font-normal"}`}
                onClick={() => setSelected(2)}
            >
                Response Body
            </p>
            <p
                className={`cursor-pointer ${selected === 3 ? "underline font-semibold" : "font-normal"}`}
                onClick={() => setSelected(3)}
            >
                Response Headers
            </p>
        </div>
    );
}
