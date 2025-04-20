"use client";

import AuthContainer from "@/components/Auth/AuthContainer";
import Input from "@/components/Forms/Input";
import OAuthButton from "@/components/Auth/OAuthButton";
import AuthHttpClient from "@/http/AuthHttpClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import GuestRoute from "../components/Auth/GuestRoute";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
    const { setUserId } = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            try {
                const { userId } = await AuthHttpClient.login(email, password);
                setUserId(userId);
                router.push("/dashboard");
            } catch {
            } finally {
            }
        },
        [email, password, setUserId, router],
    );

    return (
        <GuestRoute>
            <AuthContainer onSubmit={handleSubmit}>
                <Input
                    id="email"
                    label="Email"
                    type="text"
                    required
                    value={email}
                    onChange={setEmail}
                />
                <Input
                    id="password"
                    label="Password"
                    type="password"
                    required
                    className="mt-2"
                    value={password}
                    onChange={setPassword}
                />
                <Link
                    href="#"
                    className="text-[#9D9D9D] text-xs underline mt-8"
                >
                    Forgot Password?
                </Link>
                <button
                    type="submit"
                    className="bg-white text-black py-3 mt-3 text-sm"
                >
                    Login
                </button>
                <OAuthButton
                    src="/assets/google-icon.svg"
                    alt="google-icon"
                    provider="Google"
                />
                <OAuthButton
                    src="/assets/github-icon.svg"
                    alt="github-icon"
                    provider="GitHub"
                />
                <p className="text-xs text-[#9D9D9D] text-center mt-4">
                    Don&apos;t have an account?&nbsp;
                    <Link href="/register" className="underline">
                        Register
                    </Link>
                </p>
            </AuthContainer>
        </GuestRoute>
    );
}
