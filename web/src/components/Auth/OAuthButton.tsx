import Image from "next/image";

export default function OAuthButton({
    src,
    alt,
    provider,
}: {
    src: string;
    alt: string;
    provider: string;
}) {
    return (
        <button className="bg-[#181818] border-[#353535] border-1 text-white py-3 mt-3 flex items-center justify-center cursor-pointer text-sm">
            <Image src={src} alt={alt} width={25} height={25} />
            &nbsp; Login with {provider}
        </button>
    );
}
