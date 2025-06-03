"use client";
import Image from "next/image";
import Sphere from "@/assets/blue 2.png";
import { useUser } from "@clerk/nextjs";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { Star } from "lucide-react";

export default function WelcomeCard() {
  const { user, isLoaded } = useUser();
  // console.log(
  //   user?.unsafeMetadata.btnStatus
  // );


  return (
    <>
      {isLoaded ? (
        <div className="min-h-[300px] md:h-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 relative overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-900/20 dark:to-indigo-900/20"></div>
          <div className="absolute inset-0 z-0 opacity-50 blur-sm w-[250%] -left-24">
            <Image
              src={Sphere || "/placeholder.svg"}
              alt=""
              fill
              className="object-cover blur-xs"
              priority
            />
          </div>

          <div className="md:absolute md:top-6 md:left-6 flex items-center gap-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Star className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Welcome back,</p>
            </div>
          
          <div className="relative z-10 flex flex-col justify-center h-full md:py-0">
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 capitalize">
              {user?.username}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Glad to see you again!
              <br />
              Ask me anything.
            </p>
          </div>

        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700 p-6 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </>
  );
}