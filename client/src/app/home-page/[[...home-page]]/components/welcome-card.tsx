"use client";
import Image from "next/image";
import Sphere from "@/assets/blue 2.png";
import {useUser} from "@clerk/nextjs";
import LoadingSpinner from "@/components/ui/loadingSpinner";



interface WelcomeCardProps {
  name: string;
}

export default function WelcomeCard({ name }: WelcomeCardProps) {
    const { user , isLoaded } = useUser()

    return <>
    {
        isLoaded ?  <div className="flex font-mulish bg-gradient-to-r from-[#1D2328] to-[#243461] rounded-lg p-6 items-center relative overflow-hidden">
            {/* Sphere background image with blur */}
            <div className="absolute inset-0 z-0 opacity-50 blur-sm w-[200%] -left-20">
                <Image
                    src={Sphere || "/placeholder.svg"}
                    alt=""
                    fill
                    className="object-cover blur-xs"
                    priority
                />
            </div>

            {/* Content */}
            <div className="">
                <p className="text-gray-400 text-sm">Welcome back,</p>
                <h2 className="text-3xl font-bold text-white mt-1 capitalize">
                    {isLoaded ? user?.username : "Loading..."}
                </h2>
                <p className="text-gray-400 mt-2">
                    Glad to see you again!
                    <br />
                    Ask me anything.
                </p>
            </div>
        </div> : <LoadingSpinner/>

    }
    </>;
}
