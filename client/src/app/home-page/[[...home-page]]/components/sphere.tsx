"use client"
import Spline from '@splinetool/react-spline';

export default function Sphere() {
  return (
    <div className="relative w-full h-full min-h-[300px] rounded-lg overflow-hidden bg-white dark:bg-transparent">
      <div className="absolute inset-0 flex items-center justify-center">
        <Spline scene="https://prod.spline.design/PFx5G2qyftQjNcww/scene.splinecode" />
      </div>
    </div>
  );
}
