"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Spline from '@splinetool/react-spline';
import logo from "../../../assets/LOGO1.png";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import eye from '@/assets/eye.png';


export default function Page() {


  return (
    <>
      <div className="h-screen flex-col items-center justify-center shadow-inner-custom">

        <div className="relative h-full flex-col rounded-xl flex p-6 px-24 items-start justify-center overflow-hidden bg-gradient-to-r from-[#15191c] to-[#000000]">

          <div className="absolute inset-0 z-0 opacity-50 blur-sm w-[200%] -left-12">
            <Spline scene="https://prod.spline.design/PFx5G2qyftQjNcww/scene.splinecode" className="w-[200%]" />
          </div>

          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-8 z-10">
            <Image src={logo} alt="logo" className="w-32 opacity-80" />
          </div>



        </div>


        
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mb-4"></div>
              <p className="text-white font-medium">Website is loading...</p>
            </div>
          </div>



      </div>
    </>
  );
}
