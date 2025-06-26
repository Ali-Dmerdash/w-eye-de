import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Spline from '@splinetool/react-spline';
import logo from "../../../assets/LOGO1.png";
import loginSphere from "../../../assets/loginSphere.png";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import UserAuthForm from "./components/user-auth-form";
import "./style.css";
import eye from '@/assets/eye.png';
export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <>
      <div className="h-screen flex-col items-center justify-center shadow-inner-custom">

        <div className="relative h-full flex-col rounded-xl flex p-6 md:px-24 px-4 items-center justify-center overflow-hidden bg-gradient-to-r from-[#15191c] to-[#000000]">

          <div className="absolute z-0 opacity-50 blur-sm flex items-center justify-center inset-x-0 md:top-80 top-[32rem]">
            <Image src={loginSphere} alt="logo" />

          </div>

          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-8 z-10">
            <Image src={logo} alt="logo" className="w-32 opacity-80" />
          </div>

          <div className="w-full z-10 md:p-0 p-4 flex items-center justify-center">
            <div
              className="flex w-full flex-col justify-center items-center md:w-[400px] w-screen 
                          backdrop-blur-md bg-white/[2%] border border-white/10 rounded-2xl 
                          shadow-2xl shadow-black/20 p-4 md:p-10"
            >
              <Image src={eye || "/placeholder.svg"} alt="logo" className="animate-pulse" />

              <p className="BGT2 capitalize mt-4 mb-5">Your Vision, Your Eye</p>

              <UserAuthForm />

              <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link href="/terms" className="underline underline-offset-4 hover:text-gray-400">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline underline-offset-4 hover:text-gray-400">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

        </div>





      </div>
    </>
  );
}
