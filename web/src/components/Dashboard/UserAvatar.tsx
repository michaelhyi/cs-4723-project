import AuthHttpClient from "@/http/AuthHttpClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function UserAvatar() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    const handlePricing = useCallback(() => {
        router.push("/pricing");
    }, [router]);

    const handleLogout = useCallback(() => {
        AuthHttpClient.logout();
        router.push("/");
    }, [router]);

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 outline-none cursor-pointer duration-300 hover:opacity-75"
            >
                <Image
                    src="/assets/avatar.svg"
                    height={37.5}
                    width={37.5}
                    alt="avatar"
                />
                <p className="text-xs">&#9660;</p>
            </button>
            {isOpen && (
                <div className="absolute top-12 right-0 bg-black border-1 border-white rounded-lg">
                    <button
                        onClick={handlePricing}
                        className="text-white px-4 py-2 duration-300 hover:opacity-75 cursor-pointer"
                    >
                        Pricing
                    </button>
                    <button
                        onClick={handleLogout}
                        className="text-red-300 px-4 py-2 duration-300 hover:opacity-75 cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
