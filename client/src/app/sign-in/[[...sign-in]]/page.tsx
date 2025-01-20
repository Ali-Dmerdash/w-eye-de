import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "./components/user-auth-form";
import logo from "../../../assets/LOGO1.png";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <>
      <div className="container   bg-[#000000]  relative h-[100vh] flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative bg-[#080808] hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute z-20 mt-auto left-0 bottom-0">
            <Image src={logo} alt="Logo" height={100} />
          </div>
        </div>
        <div className="relative flex flex-col justify-center items-center">
          <Image src={logo} alt="Logo" height={100} />
          <p className="text-lg text-muted-foreground">Your Vision, Your Eye</p>
          <UserAuthForm />
          <Link
            href="/examples/authentication"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              " bg-slate-100 mt-4 w-1/2"
            )}
          >
            Login
          </Link>
        </div>
      </div>
    </>
  );
}
