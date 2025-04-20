"use client";

import Loading from "@/components/Loading";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import ProxyLog from "@/components/ViewProxy/ProxyLog";
import ProxyHttpClient from "@/http/ProxyHttpClient";
import { ProxyWithLogs } from "@/utils/types";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function ProxyPage({
    params,
}: {
    params: Promise<{ proxyId: string }>;
}) {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<ProxyWithLogs | null>(null);
    const [expanded, setExpanded] = useState<number>(-1);
    const existingLogIds = useRef(new Set());

    useEffect(() => {
        (async () => {
            try {
                const { proxyId } = await params;
                const { proxy: proxyWithLogs } =
                    await ProxyHttpClient.getProxyWithLogsByProxyId(proxyId);

                setData(proxyWithLogs);

                const ws = new WebSocket(`http://${proxyWithLogs.proxyUrl}/ws`);

                ws.onmessage = (e) => {
                    const log = JSON.parse(e.data);

                    try {
                        log.requestBody = JSON.parse(log.requestBody);
                    } catch {
                        log.requestBody = log.requestBody;
                    }

                    try {
                        log.responseBody = JSON.parse(log.responseBody);
                    } catch {
                        log.responseBody = log.responseBody;
                    }

                    log.requestHeaders = JSON.parse(log.requestHeaders);
                    log.responseHeaders = JSON.parse(log.responseHeaders);

                    if (!existingLogIds.current.has(log.proxyLogId)) {
                        existingLogIds.current.add(log.proxyLogId);
                        setData((prevData) => {
                            if (prevData) {
                                return {
                                    ...prevData,
                                    logs: [...prevData.logs, log],
                                };
                            }
                            return prevData;
                        });
                    }
                };

                ws.onerror = (err) => {
                    console.error("WebSocket error:", err);
                };

                return () => {
                    ws.close();
                };
            } catch (error) {
                console.error("Error fetching proxy data:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [params]);

    if (loading) {
        return <Loading />;
    }

    return (
        data && (
            <ProtectedRoute>
                <main className="px-20 py-18 flex flex-col">
                    <Link className="text-[#939393] text-sm" href="/dashboard">
                        &larr;&nbsp;&nbsp;Back to Home
                    </Link>
                    <h1 className="mt-3 mb-5 font-bold text-4xl">
                        {data.name}
                    </h1>

                    <div className="mt-2 text-sm flex gap-16">
                        <p>
                            <span className="font-medium">Cloud Provider:</span>
                            &nbsp;
                            <span className="text-[#A5A2A2]">
                                {data.cloudProvider}
                            </span>
                        </p>
                        <p>
                            <span className="font-medium">
                                Cloud Provider Region:
                            </span>
                            &nbsp;
                            <span className="text-[#A5A2A2]">
                                {data.cloudRegion}
                            </span>
                        </p>
                        <p>
                            <span className="font-medium">Pricing Plan:</span>
                            &nbsp;
                            <span className="text-[#A5A2A2]">
                                {data.pricingPlan}
                            </span>
                        </p>
                        <p>
                            <span className="font-medium">API Protocol:</span>
                            &nbsp;
                            <span className="text-[#A5A2A2]">
                                {data.apiProtocol}
                            </span>
                        </p>
                    </div>
                    <div className="mt-2 text-sm flex gap-16">
                        <p>
                            <span className="font-medium">Proxy URL:</span>
                            &nbsp;
                            <span className="text-[#A5A2A2]">
                                {data.proxyUrl}
                            </span>
                        </p>
                        <p>
                            <span className="font-medium">Base API URL:</span>
                            &nbsp;
                            <span className="text-[#A5A2A2]">
                                {data.apiBaseUrl}
                            </span>
                        </p>
                    </div>

                    <div
                        id="logs"
                        className="mt-18 border border-[#A2A5A5] rounded-lg h-128 overflow-y-auto p-3"
                    >
                        {data.logs.map((log) => (
                            <ProxyLog
                                key={log.proxyLogId}
                                log={log}
                                expanded={expanded}
                                setExpanded={setExpanded}
                            />
                        ))}
                    </div>
                </main>
            </ProtectedRoute>
        )
    );
}
