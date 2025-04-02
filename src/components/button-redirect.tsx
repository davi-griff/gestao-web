"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function ButtonRedirect({ children, href }: { children: React.ReactNode, href: string }) {
    const router = useRouter();
    return (
        <Button onClick={() => router.push(href)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            {children}
        </Button>
    )
}
