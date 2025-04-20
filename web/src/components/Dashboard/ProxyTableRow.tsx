import { useRouter } from "next/navigation";
import { useCallback } from "react";
import TableDataCell from "./TableDataCell";
import { mapStatus } from "@/utils/proxyUtils";

export default function ProxyTableRow({
    proxyId,
    name,
    status,
    cloudProvider,
    cloudRegion,
    pricing,
    proxyUrl,
    baseApiUrl,
    apiProtocol,
}: {
    proxyId: number;
    name: string;
    status: string;
    cloudProvider: string;
    cloudRegion: string;
    pricing: string;
    proxyUrl: string;
    baseApiUrl: string;
    apiProtocol: string;
}) {
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push(`/proxy/${proxyId}`);
    }, [proxyId, router]);

    return (
        <tr onClick={handleClick} className="cursor-pointer">
            <td className="px-8 py-6">{name}</td>
            <td className="px-8 py-6">{mapStatus(status)}</td>
            <TableDataCell>{cloudProvider}</TableDataCell>
            <TableDataCell>{cloudRegion}</TableDataCell>
            <TableDataCell>{pricing}</TableDataCell>
            <TableDataCell>{proxyUrl}</TableDataCell>
            <TableDataCell>{baseApiUrl}</TableDataCell>
            <TableDataCell>{apiProtocol}</TableDataCell>
        </tr>
    );
}
