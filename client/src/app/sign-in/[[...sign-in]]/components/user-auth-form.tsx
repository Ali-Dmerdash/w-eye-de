"use client";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
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
import { useUser } from "@clerk/nextjs";
import { useNotifications } from "@/context/NotificationContext";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export default function UserAuthForm() {
  const { user, isSignedIn } = useUser();
  const { addNotification } = useNotifications();
  const notifiedRef = useRef(false);


  useEffect(() => {
    async function notifyOnSignIn() {
      if (isSignedIn && user && !notifiedRef.current) {
        try {
          const res = await fetch("https://api.ipify.org?format=json");
          const data = await res.json();
          const ip = data.ip;
          await addNotification({
            title: "New login detected",
            message: `Our system has detected a new login from the IP address: ${ip}.
If this was you, please ignore this message.
If this was not you, please contact support immediately.`,
            type: "info",
          });
          notifiedRef.current = true;
          
        } catch (e) {
          // Optionally handle error
        }
      }
      if (!isSignedIn) {
        notifiedRef.current = false;
      }
    }
    notifyOnSignIn();
    // Removed problematic redirect - let ProtectedRoute handle post-login routing
  }, [isSignedIn, user, addNotification]);

  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <SignIn.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignIn.Step name="start">
                <Card className="w-full sm:w-96 bg-transparent text-white border-none">
                  <CardContent className="grid gap-y-4">
                    <Clerk.Field name="identifier" className="space-y-2">


                      <div className="relative z-0">
                        <Clerk.Input
                          type="email"
                          required
                          asChild
                          id="floating_standard"
                          className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 rounded-b-none border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 focus-visible:ring-0 peer"
                          placeholder=" "
                        >
                          <Input />
                        </Clerk.Input>
                        <Clerk.Label
                          asChild
                          htmlFor="floating_standard"
                          className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                        >
                          <Label>Email your email</Label>
                        </Clerk.Label>
                      </div>

                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                  </CardContent>

                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignIn.Action submit asChild>
                        <Button
                          disabled={isGlobalLoading}
                          className="border-2 border-gray-600 bg-transparent text-white"
                        >
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icon
                                  icon="svg-spinners:90-ring"
                                  width="24"
                                  height="24"
                                />
                              ) : (
                                "Continue"
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignIn.Action>
                    </div>
                  </CardFooter>
                </Card>
              </SignIn.Step>

              <SignIn.Step name="choose-strategy">
                <Card className="w-full sm:w-96">
                  <CardHeader>
                    <CardTitle>Use another method</CardTitle>
                    <CardDescription>
                      Facing issues? You can use any of these methods to sign
                      in.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    <SignIn.SupportedStrategy name="email_code" asChild>
                      <Button
                        type="button"
                        variant="link"
                        disabled={isGlobalLoading}
                      >
                        Email code
                      </Button>
                    </SignIn.SupportedStrategy>
                    <SignIn.SupportedStrategy name="password" asChild>
                      <Button
                        type="button"
                        variant="link"
                        disabled={isGlobalLoading}
                      >
                        Password
                      </Button>
                    </SignIn.SupportedStrategy>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignIn.Action navigate="previous" asChild>
                        <Button disabled={isGlobalLoading}>
                          <Clerk.Loading>
                            {(isLoading) => {
                              return isLoading ? (
                                <Icon
                                  icon="svg-spinners:90-ring"
                                  width="24"
                                  height="24"
                                />
                              ) : (
                                "Go back"
                              );
                            }}
                          </Clerk.Loading>
                        </Button>
                      </SignIn.Action>
                    </div>
                  </CardFooter>
                </Card>
              </SignIn.Step>

              <SignIn.Step name="verifications">
                <SignIn.Strategy name="password">
                  <Card className="w-full sm:w-96 bg-transparent border-0 ">

                    <CardContent className="grid gap-y-4">
                      <Clerk.Field name="password" className="space-y-2">
                        <div className="relative z-0">
                          <Clerk.Input
                            type="password"
                            required
                            asChild
                            id="floating_standard"
                            className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 rounded-b-none border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 focus-visible:ring-0 peer"
                            placeholder=" "
                          >
                            <Input />
                          </Clerk.Input>
                          <Clerk.Label
                            asChild
                            htmlFor="floating_standard"
                            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                          >
                            <Label>Enter your password</Label>
                          </Clerk.Label>
                        </div>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignIn.Action submit asChild>
                          <Button disabled={isGlobalLoading}>
                            <Clerk.Loading>
                              {(isLoading) => {
                                return isLoading ? (
                                  <Icon
                                    icon="svg-spinners:90-ring"
                                    width="24"
                                    height="24"
                                  />
                                ) : (
                                  "Continue"
                                );
                              }}
                            </Clerk.Loading>
                          </Button>
                        </SignIn.Action>
                        <SignIn.Action navigate="choose-strategy" asChild>
                          <Button
                            type="button"
                            size="sm"
                            variant="link"
                            className="text-white"
                          >
                            Use another method
                          </Button>
                        </SignIn.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignIn.Strategy>

                <SignIn.Strategy name="email_code">
                  <Card className="w-full sm:w-96">
                    <CardHeader>
                      <CardTitle>Check your email</CardTitle>
                      <CardDescription>
                        Enter the verification code sent to your email
                      </CardDescription>

                    </CardHeader>
                    <CardContent className="grid gap-y-4">
                      <Clerk.Field name="code">
                        <Clerk.Label className="sr-only">
                          Email verification code
                        </Clerk.Label>
                        <div className="grid gap-y-2 items-center justify-center">
                          <div className="flex justify-center text-center">
                            <Clerk.Input
                              type="otp"
                              autoSubmit
                              className="flex justify-center has-[:disabled]:opacity-50"
                              render={({ value, status }) => {
                                return (
                                  <div
                                    data-status={status}
                                    className="relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md data-[status=selected]:ring-1 data-[status=selected]:ring-ring data-[status=cursor]:ring-1 data-[status=cursor]:ring-ring"
                                  >
                                    {value}
                                  </div>
                                );
                              }}
                            />
                          </div>
                          <Clerk.FieldError className="block text-sm text-destructive text-center" />
                          <SignIn.Action
                            asChild
                            resend
                            className="text-muted-foreground"
                            fallback={({ resendableAfter }) => (
                              <Button variant="link" size="sm" disabled>
                                Didn&apos;t receive a code? Resend (
                                <span className="tabular-nums">
                                  {resendableAfter}
                                </span>
                                )
                              </Button>
                            )}
                          >
                            <Button variant="link" size="sm">
                              Didn&apos;t receive a code? Resend
                            </Button>
                          </SignIn.Action>
                        </div>
                      </Clerk.Field>
                    </CardContent>
                    <CardFooter>
                      <div className="grid w-full gap-y-4">
                        <SignIn.Action submit asChild>
                          <Button disabled={isGlobalLoading}>
                            <Clerk.Loading>
                              {(isLoading) => {
                                return isLoading ? (
                                  <Icon
                                    icon="svg-spinners:90-ring"
                                    width="24"
                                    height="24"
                                  />
                                ) : (
                                  "Continue"
                                );
                              }}
                            </Clerk.Loading>
                          </Button>
                        </SignIn.Action>
                        <SignIn.Action navigate="choose-strategy" asChild>
                          <Button size="sm" variant="link">
                            Use another method
                          </Button>
                        </SignIn.Action>
                      </div>
                    </CardFooter>
                  </Card>
                </SignIn.Strategy>
              </SignIn.Step>
            </>
          )}
        </Clerk.Loading>
      </SignIn.Root>
    </div>
  );
}