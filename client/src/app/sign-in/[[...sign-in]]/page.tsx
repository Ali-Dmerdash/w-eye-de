
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Spline from '@splinetool/react-spline';
import logo from "../../../assets/LOGO1.png";
import { cn } from "@/lib/utils";
import { Button,buttonVariants } from "@/components/ui/button";
import UserAuthForm from "./components/user-auth-form";
import "./style.css";
export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 p-2">
        <div className="relative hidden h-full flex-col  BGL rounded-xl  lg:flex">
          <Image src={logo} alt="logo" className="absolute bottom-0 left-0" />
          <Spline scene="https://prod.spline.design/PFx5G2qyftQjNcww/scene.splinecode"/>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center items-center sm:w-[350px]">
            <Image src={logo} alt="logo" height={70} />
            <p className="BGT capitalize mb-5">Your Vision, Your Eye</p>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
