"use client";
import Image from "next/image";
import Sphere from "@/assets/blue 2.png";

interface WelcomeCardProps {
  name: string;
}

export default function WelcomeCard({ name }: WelcomeCardProps) {
  return (
    <div className="bg-[#1d2328] rounded-lg p-6 relative overflow-hidden">
      {/* Sphere background image with blur */}
      <div className="absolute inset-0 z-0 opacity-30">
        <Image
          src={Sphere || "/placeholder.svg"}
          alt=""
          fill
          className="object-cover blur-xs"
          priority
        />
        <div className="absolute inset-0 bg-[#1d2328] opacity-60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <p className="text-gray-400 text-sm">Welcome back,</p>
        <h2 className="text-2xl font-bold text-white mt-1">{name}</h2>
        <p className="text-gray-400 mt-2">
          Glad to see you again!
          <br />
          Ask me anything.
        </p>
      </div>
    </div>
  );
}
