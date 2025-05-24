"use client";
import Image from "next/image";
import Sphere from "@/assets/blue 2.png";
import { useUser } from "@clerk/nextjs";
import LoadingSpinner from "@/components/ui/loadingSpinner";

export default function WelcomeCard() {
  const { user, isLoaded } = useUser();
  // console.log(
  //   user?.unsafeMetadata.btnStatus
  // );


  return (
    <>
      {isLoaded ? (
        <div className="flex font-mulish rounded-lg p-6 items-center relative overflow-hidden bg-gradient-to-r from-[#4B65AB] to-[#9394A5] dark:bg-gradient-to-r dark:from-[#1D2328] dark:to-[#243461]">
          <div className="absolute inset-0 z-0 opacity-50 blur-sm w-[200%] -left-20">
            <Image
              src={Sphere || "/placeholder.svg"}
              alt=""
              fill
              className="object-cover blur-xs"
              priority
            />
          </div>
          <div className="z-10">
            <p className="font-bold text-sm text-[#AEC3FF] dark:text-gray-400">Welcome back,</p>
            <h2 className="text-3xl font-bold text-white mt-1 capitalize">
              {user?.username}
            </h2>
            <p className="mt-2 text-[#AEC3FF] dark:text-gray-400">
              Glad to see you again!
              <br />
              Ask me anything.
            </p>
          </div>
          
        </div>
        
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}