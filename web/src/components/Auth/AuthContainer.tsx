export default function AuthContainer({
    children,
    onSubmit,
}: {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
    return (
        <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/6">
            <h1 className="text-center font-bold text-4xl">APIVeil</h1>
            <form className="flex flex-col mt-8" onSubmit={onSubmit}>
                {children}
            </form>
        </main>
    );
}
