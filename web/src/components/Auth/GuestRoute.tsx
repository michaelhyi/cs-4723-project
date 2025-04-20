"use client";

import AuthHttpClient from "@/http/AuthHttpClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import { useUser } from "@/context/UserContext";

export default function GuestRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const { setUserId } = useUser();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { user } = await AuthHttpClient.getMe();
                setUserId(user.userId);
                router.push("/dashboard");
            } catch {
                setUserId(null);
                setLoading(false);
            }
        })();
    }, [router, setUserId, setLoading]);

    if (loading) {
        return <Loading />;
    }

    return children;
}
