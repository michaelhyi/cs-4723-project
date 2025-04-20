export default function TableDataCell({
    children,
}: {
    children: React.ReactNode;
}) {
    return <td className="px-8 py-6">{children}</td>;
}
