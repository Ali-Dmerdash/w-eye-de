"use client"
import Image from "next/image"
import Sphere from "@/assets/blue 2.png"

export default function SphereVisualization() {
  return (
    <div className="relative w-full h-full min-h-[300px] rounded-lg overflow-hidden bg-[#15191c]">
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={Sphere}
          alt="Sphere Visualization"
          className="w-[120%] h-[150%] object-fit "
          priority
        />
      </div>
    </div>
  )
}
