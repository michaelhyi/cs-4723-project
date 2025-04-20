"use client";

import Loading from "@/components/Loading";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import ProxyTableRow from "@/components/Dashboard/ProxyTableRow";
import { useUser } from "@/context/UserContext";
import ProxyHttpClient from "@/http/ProxyHttpClient";
import { Proxy } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import UserAvatar from "@/components/Dashboard/UserAvatar";

export default function Dashboard() {
    const { userId } = useUser();
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<Proxy[]>([]);

    useEffect(() => {
        (async () => {
            try {
                if (userId) {
                    const { proxies } =
                        await ProxyHttpClient.getAllProxiesByUserId(userId!);
                    setData(proxies);
                }
            } catch {
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    if (loading) {
        return <Loading />;
    }

    return (
        <ProtectedRoute>
            <main className="px-20 py-18 flex flex-col">
                <nav className="flex items-center">
                    <h1 className="font-bold text-4xl">Developer Dashboard</h1>
                    <Link
                        href="/proxy/create"
                        className="ml-auto bg-white text-black font-semibold px-3 py-2 rounded-lg cursor-pointer mr-8 text-sm"
                    >
                        Create Proxy +
                    </Link>
                    <UserAvatar />
                </nav>
                <h3 className="text-[#A5A2A2]">
                    Manage all running reverse proxies and servers.
                </h3>
                <table className="mt-12 border-[#A2A5A5] border-1 w-full text-left text-sm">
                    <thead>
                        <tr className="bg-[#181818] border-b-[#A2A5A5] border-b-1">
                            <th className="px-8 py-6 font-normal">Name</th>
                            <th className="px-8 py-6 font-normal">Status</th>
                            <th className="px-8 py-6 font-normal">
                                Cloud Provider
                            </th>
                            <th className="px-8 py-6 font-normal">
                                Cloud Region
                            </th>
                            <th className="px-8 py-6 font-normal">
                                Pricing Plan
                            </th>
                            <th className="px-8 py-6 font-normal">Proxy URL</th>
                            <th className="px-8 py-6 font-normal">
                                API Base URL
                            </th>
                            <th className="px-8 py-6 font-normal">
                                API Protocol
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((proxy) => (
                            <ProxyTableRow
                                key={proxy.proxyId}
                                proxyId={proxy.proxyId}
                                name={proxy.name}
                                status={proxy.status}
                                cloudProvider={proxy.cloudProvider}
                                cloudRegion={proxy.cloudRegion}
                                pricing={proxy.pricingPlan}
                                proxyUrl={proxy.proxyUrl}
                                baseApiUrl={proxy.apiBaseUrl}
                                apiProtocol={proxy.apiProtocol}
                            />
                        ))}
                    </tbody>
                </table>
                <p className="flex items-center ml-auto mt-4 gap-2">
                    <Image
                        src="/assets/chevron-left.svg"
                        width={25}
                        height={25}
                        alt="chevron-left"
                    />
                    <span className="text-sm">Page 1 of 1</span>
                    <Image
                        src="/assets/chevron-right.svg"
                        width={25}
                        height={25}
                        alt="chevron-right"
                    />
                </p>
            </main>
        </ProtectedRoute>
    );
}
