import { formatJson } from "@/utils/proxyUtils";

export default function JsonView({ json }: { json: string | null }) {
    return (
        <pre className="bg-[#212121] text-white w-1/3 text-sm p-4 rounded-lg overflow-auto whitespace-pre-wrap break-words mt-4 ml-10">
            {formatJson(json)}
        </pre>
    );
}
