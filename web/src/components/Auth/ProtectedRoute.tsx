"use client";

import AuthHttpClient from "@/http/AuthHttpClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useUser } from "@/context/UserContext";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { setUserId } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { user } = await AuthHttpClient.getMe();
                setUserId(user.userId);
                setLoading(false);
            } catch {
                setUserId(null);
                router.push("/");
            }
        })();
    }, [router, setUserId, setLoading]);

    if (loading) {
        return <Loading />;
    }

    return children;
}
