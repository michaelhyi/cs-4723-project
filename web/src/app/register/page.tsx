"use client";

import AuthContainer from "@/components/Auth/AuthContainer";
import Input from "@/components/Forms/Input";
import OAuthButton from "@/components/Auth/OAuthButton";
import AuthHttpClient from "@/http/AuthHttpClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import GuestRoute from "@/components/Auth/GuestRoute";
import { useUser } from "@/context/UserContext";

export default function Register() {
    const router = useRouter();
    const { setUserId } = useUser();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            try {
                const { userId } = await AuthHttpClient.register(
                    name,
                    email,
                    password,
                    confirmPassword,
                );
                setUserId(userId);
                router.push("/dashboard");
            } catch {
            } finally {
            }
        },
        [name, email, password, confirmPassword, setUserId, router],
    );

    return (
        <GuestRoute>
            <AuthContainer onSubmit={handleSubmit}>
                <Input
                    id="name"
                    label="Name"
                    type="text"
                    required
                    value={name}
                    onChange={setName}
                />
                <Input
                    id="email"
                    label="Email"
                    type="text"
                    required
                    className="mt-2"
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
                <Input
                    id="confirm-password"
                    label="Confirm Password"
                    type="password"
                    required
                    className="mt-2"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                />
                <button
                    type="submit"
                    className="bg-white text-black py-3 mt-8 text-sm"
                >
                    Register
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
                    Already have an account?&nbsp;
                    <Link href="/" className="underline">
                        Login
                    </Link>
                </p>
            </AuthContainer>
        </GuestRoute>
    );
}
