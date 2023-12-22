"use client";
import React, { ReactElement, useEffect } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link"

import { Box } from "@mui/material";
import { cn } from "@/lib/utils"

import { navigationHandler } from "@/utils/nav";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/userAuthForm";


export default function AuthPage(): ReactElement {
  const router: AppRouterInstance = useRouter();
  // ------------------------------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    // if client is already logged in (if client name is stored in localstorage), we redirect him to the dashboard page directly by skipping the login page
    if (localStorage.getItem("client")) {
      navigationHandler("/console/dashboard", router);
    }
  }, []);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      <Box className="container relative h-[100vh] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="mailto:dima.dimenko@assisterr.xyz"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8 text-[#64748B]"
          )}
        >
          support: dima.dimenko@assisterr.xyz
        </Link>

        <Box className="relative hidden h-full flex-col bg-muted bg-white p-10 dark:border-r lg:flex">
          <Box className="absolute inset-0">
            <Image
              src="/imgs/bg-full.png"
              fill
              alt="Authentication"
              style={{objectFit: 'cover'}}
              quality={100}
              priority
            />
          </Box>
          <Box className="relative z-20 flex items-center text-lg font-medium">
            <Image src={'/imgs/logo.svg'} alt={'logo'} width={156} height={28}/>
          </Box>
          <Box className="relative z-20 mt-auto text-center">
              <p className="text-lg">
                Automating real-time developer relations with AI
              </p>
          </Box>
        </Box>
        <Box className="lg:p-8">
          <Box className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Box className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign In
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
            </Box>
            <UserAuthForm />
          </Box>
        </Box>
      </Box>
    </>
  );
}
