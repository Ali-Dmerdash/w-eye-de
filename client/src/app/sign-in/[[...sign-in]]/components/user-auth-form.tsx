"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";

export default function UserAuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple mock login - in a real app, you would validate credentials
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to home page after "login"
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <form onSubmit={handleSubmit}>
        <Card className="w-full sm:w-96 bg-transparent text-white border-none">
          <CardContent className="grid gap-y-4 pt-6">
            <div className="space-y-2">
              <div className="relative z-0">
                <Input
                  type="email"
                  required
                  id="email"
                  className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 rounded-b-none border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 focus-visible:ring-0 peer"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Label
                  htmlFor="email"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  Enter your email
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative z-0">
                <Input
                  type="password"
                  required
                  id="password"
                  className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 rounded-b-none border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 focus-visible:ring-0 peer"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Label
                  htmlFor="password"
                  className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  Enter your password
                </Label>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="grid w-full gap-y-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="border-2 border-gray-600 bg-transparent text-white"
              >
                {isLoading ? (
                  <Icon
                    icon="svg-spinners:90-ring"
                    width="24"
                    height="24"
                  />
                ) : (
                  "Sign In"
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}