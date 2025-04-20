"use client";

import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import Loading from "@/components/Loading";
import { useUser } from "@/context/UserContext";
import AuthHttpClient from "@/http/AuthHttpClient";
import PricingHttpClient from "@/http/PricingHttpClient";
import getStripe from "@/utils/get-stripe";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function Pricing() {
    const { userId } = useUser();
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPlan, setCurrentPlan] = useState<string>("Free");

    const handleClick = useCallback(async () => {
        if (!userId) {
            return;
        }

        try {
            const { sessionId } =
                await PricingHttpClient.subscribeToEnterprisePlan(userId);
            const stripe = await getStripe();
            await stripe?.redirectToCheckout({ sessionId });
        } catch {}
    }, [userId]);

    useEffect(() => {
        (async () => {
            try {
                const { user } = await AuthHttpClient.getMe();
                setCurrentPlan(user.pricingPlan.toLowerCase());
            } finally {
                setLoading(false);
            }
        })();
    }, [setCurrentPlan]);

    if (loading) {
        return <Loading />;
    }
    return (
        <ProtectedRoute>
            <main className="px-20 py-18 flex flex-col">
                <Link className="text-[#939393] text-sm" href="/dashboard">
                    &larr;&nbsp;&nbsp;Back to Home
                </Link>
                <h1 className="mt-3 font-bold text-4xl">
                    Manage Your Subscription
                </h1>
                <h3 className="text-[#A5A2A2]">
                    You are currently on the {currentPlan} plan. Manage your
                    subscription here.
                </h3>
                <div className="mt-12 flex justify-center space-x-4">
                    <div
                        className={`border rounded-lg p-12 shadow-md w-1/2 ${currentPlan === "free" ? "border-green-500" : ""}`}
                    >
                        <h2 className="font-bold text-4xl">
                            Free Plan{" "}
                            {currentPlan === "Free" && (
                                <span className="text-green-500">✔️</span>
                            )}
                        </h2>
                        <ul className="list-disc list-inside mt-2 text-lg">
                            <li>Access to basic features</li>
                            <li>Community support</li>
                            <li>Limited usage</li>
                        </ul>
                    </div>
                    <div
                        className={`border rounded-lg p-12 shadow-md w-1/2 ${currentPlan === "enterprise" ? "border-green-500" : ""}`}
                    >
                        <h2 className="font-bold text-4xl">
                            Enterprise Plan{" "}
                            {currentPlan === "Enterprise" && (
                                <span className="text-green-500">✔️</span>
                            )}
                        </h2>
                        <ul className="list-disc list-inside mt-2 text-lg">
                            <li>All features included</li>
                            <li>Priority support</li>
                            <li>Custom integrations</li>
                            <li>Unlimited usage</li>
                        </ul>
                        {currentPlan !== "enterprise" && (
                            <button
                                onClick={handleClick}
                                className="mt-16 text-black bg-white rounded-md px-4 py-2 cursor-pointer duration-300 hover:opacity-75"
                            >
                                Subscribe to Enterprise Plan
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}
