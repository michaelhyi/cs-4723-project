"use client";

import Input from "@/components/Forms/Input";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Select from "@/components/Forms/Select";
import ProxyHttpClient from "@/http/ProxyHttpClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Spinner from "@/components/Spinner";

export default function CreateProxy() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [cloudProvider, setCloudProvider] = useState("");
    const [cloudProviderRegion, setCloudProviderRegion] = useState("");
    const [pricingPlan, setPricingPlan] = useState("");
    const [baseApiUrl, setBaseApiUrl] = useState("");
    const [apiProtocol, setApiProtocol] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            try {
                setLoading(true);
                const { proxyId } = await ProxyHttpClient.createProxy({
                    name,
                    cloudProvider,
                    cloudProviderRegion,
                    pricingPlan,
                    baseApiUrl,
                    apiProtocol,
                });
                router.push(`/proxy/${proxyId}`);
            } catch {
            } finally {
                setLoading(false);
            }
        },
        [
            name,
            cloudProvider,
            cloudProviderRegion,
            pricingPlan,
            baseApiUrl,
            apiProtocol,
            router,
        ],
    );

    return (
        <ProtectedRoute>
            <main className="px-20 py-18 flex flex-col">
                <Link className="text-[#939393] text-sm" href="/dashboard">
                    &larr;&nbsp;&nbsp;Back to Home
                </Link>
                <h1 className="mt-3 font-bold text-4xl">Create New Proxy</h1>
                <h3 className="text-[#A5A2A2]">
                    Empower your API by spinning up a new reverse proxy using
                    your cloud provider of choice.
                </h3>
                <form
                    className="mt-12 grid grid-cols-2 max-w-[700px] items-center"
                    onSubmit={handleSubmit}
                >
                    <Input
                        id="name"
                        label="Name"
                        type="text"
                        required
                        value={name}
                        onChange={setName}
                        className="w-[256px]"
                    />
                    <Select
                        id="cloud-provider"
                        label="Cloud Provider"
                        required
                        value={cloudProvider}
                        onChange={setCloudProvider}
                        className="w-[256px]"
                        options={[
                            "Amazon Web Services",
                            "Google Cloud",
                            "Azure",
                        ]}
                    />
                    <Input
                        id="cloud-provider-region"
                        label="Cloud Provider Region"
                        type="text"
                        required
                        value={cloudProviderRegion}
                        onChange={setCloudProviderRegion}
                        className="w-[256px] mt-4"
                    />
                    <Select
                        id="pricing-plan"
                        label="Pricing Plan"
                        required
                        value={pricingPlan}
                        onChange={setPricingPlan}
                        className="w-[256px] mt-4"
                        options={["Free", "Enterprise"]}
                    />
                    <Input
                        id="base-api-url"
                        label="Base API URL"
                        type="text"
                        required
                        value={baseApiUrl}
                        onChange={setBaseApiUrl}
                        className="w-[256px] mt-4"
                    />
                    <Select
                        id="api-protocol"
                        label="API Protocol"
                        required
                        value={apiProtocol}
                        onChange={setApiProtocol}
                        className="w-[256px] mt-4"
                        options={[
                            "REST",
                            "WebHooks",
                            "GraphQL",
                            "SOAP",
                            "WebSocket",
                            "gRPC",
                            "MQTT",
                            "AQMP",
                            "SSE",
                            "EDI",
                            "EDA",
                        ]}
                    />
                    <div className="flex items-center mt-92 gap-4">
                        <button
                            type="submit"
                            className="bg-white text-black font-semibold w-[96px] py-2 rounded-lg cursor-pointer"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <Spinner />
                                </div>
                            ) : (
                                "Create"
                            )}
                        </button>
                        <Link
                            href="/dashboard"
                            className="text-center bg-black text-white border-1 border-white font-semibold w-[96px] py-2 rounded-lg"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </main>
        </ProtectedRoute>
    );
}
