"use client"
import Image from "next/image"
import Sphere from "@/assets/blue 2.png"
import Spline from '@splinetool/react-spline';

export default function SphereVisualization() {
  return (
    <div className="relative w-full h-full min-h-[300px] rounded-lg overflow-hidden bg-[#15191c]">
      <div className="absolute inset-0 flex items-center justify-center">


        {/* Spline scene code width should be handled ! */}
        <Spline scene="https://prod.spline.design/PFx5G2qyftQjNcww/scene.splinecode" />

      </div>
    </div>
  )
}
