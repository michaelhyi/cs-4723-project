import ProxyLogHttpClient from "@/http/ProxyLogHttpClient";
import { formatTimestamp } from "@/utils/proxyUtils";
import { ProxyLog as ProxyLogType } from "@/utils/types";
import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import ProxyLogTabs from "./ProxyLogTabs";
import JsonView from "./JsonView";
import Spinner from "@/components/Spinner";

export default function ProxyLog({
    log,
    expanded,
    setExpanded,
}: {
    log: ProxyLogType;
    expanded: number;
    setExpanded: Dispatch<SetStateAction<number>>;
}) {
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(0);
    const [analysis, setAnalysis] = useState<string | null>(null);

    const handleExpand = useCallback(() => {
        if (expanded === log.proxyLogId) {
            setExpanded(-1);
        } else {
            setExpanded(log.proxyLogId);
        }
    }, [log.proxyLogId, expanded, setExpanded]);

    const handleAnalyze = useCallback(async () => {
        setLoading(true);
        try {
            const { analysis } = await ProxyLogHttpClient.analyzeProxyLog(
                log.proxyLogId.toString(),
            );
            setAnalysis(analysis);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [log, setAnalysis]);

    return (
        <div className="flex flex-col mt-4 ml-6">
            <div
                key={log.proxyLogId}
                className="flex items-center gap-3 text-sm cursor-pointer"
                onClick={handleExpand}
            >
                {expanded === log.proxyLogId ? (
                    <Image
                        alt="collapse"
                        width={25}
                        height={25}
                        src="/assets/chevron-bottom.svg"
                    />
                ) : (
                    <Image
                        alt="expand"
                        width={25}
                        height={25}
                        src="/assets/chevron-right.svg"
                    />
                )}
                <p>{formatTimestamp(log.timestamp)}</p>
                <p className="text-white">
                    {log.method}&nbsp;{log.path}
                </p>
                <p
                    className={`font-semibold px-2 rounded-md ${
                        log.statusCode >= 200 && log.statusCode < 300
                            ? "text-[#89DA9F] bg-[#143518]"
                            : log.statusCode >= 400 && log.statusCode <= 500
                              ? "text-[#EFA296] bg-[#521F0F]"
                              : "text-gray-500"
                    }`}
                >
                    {log.statusCode}
                </p>
            </div>
            {expanded === log.proxyLogId && (
                <div className="mb-8">
                    <ProxyLogTabs
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <div className="flex gap-12 items-start">
                        <JsonView
                            json={
                                selected === 0
                                    ? log.requestBody
                                    : selected === 1
                                      ? log.requestHeaders
                                      : selected === 2
                                        ? log.responseBody
                                        : selected === 3
                                          ? log.responseHeaders
                                          : null
                            }
                        />
                        <div className="w-1/3">
                            <button
                                onClick={handleAnalyze}
                                className="h-12 border-1 rounded-md px-2 text-sm cursor-pointer"
                            >
                                {loading ? <Spinner /> : "Analyze with AI"}
                            </button>
                            <p className="mt-4">{analysis}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
