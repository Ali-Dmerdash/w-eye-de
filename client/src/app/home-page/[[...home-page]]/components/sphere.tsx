"use client"
import Spline from '@splinetool/react-spline';

export default function Sphere() {
  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden">
      <Spline scene="https://prod.spline.design/PFx5G2qyftQjNcww/scene.splinecode" />
    </div>
  );
}
