export default function FormElement({
    id,
    label,
    className,
    children,
}: {
    id: string;
    label: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <label htmlFor={id}>{label}</label>
            {children}
        </div>
    );
}
