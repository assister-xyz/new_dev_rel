"use client";

import React, { ReactElement, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import bgImage from "../../../public/imgs/bg.svg";
import logoImage from "../../../public/imgs/logo.svg";
import { loginCheckHandler } from "@/utils/auth";
import { capitalizeFirstLetter } from "@/utils/general";
import { navigationHandler } from "@/utils/nav";
import { UserNavigation } from "@/components/navigation/UserNavigation";
import { MainNavigation } from "@/components/navigation/MainNavigation";
import Link from "next/link";

// this layout is rendered for all pages navigation under the "/console"
export default function ConsoleLayout({ children }: { children: ReactElement }): ReactElement {
  const router: AppRouterInstance = useRouter();
  const [targetClient, setTargetClient] = useState<string>("");

  // ------------------------------------------------------------------------------------------------------

  useEffect(() => {
    // we check if the client is logged in, if not we redirect him to the login page
    const authCheckResult: string = loginCheckHandler();
    if (authCheckResult === "unauthorized") {
      navigationHandler("/", router);
    } else {
      setTargetClient(localStorage.getItem("client")!);
    }
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    // the overall main flex container box for all console routes
    <Box className='relative h-full'>
      {/* this is for background back layer image */}
      <Box className='absolute left-[50%] -z-10 translate-x-[-50%]'>
        <Box className='h-[230px] w-[800px]'>
          <Image src={bgImage} alt='assisterr logo' fill priority />
        </Box>
      </Box>
      {/* ------------------------------------------------------------------------------------------------------ */}
      {/* assisterr logo section */}
      <Box className='ml-5 pt-5' width={"130px"}>
        <Image src={logoImage} alt='assisterr logo' width={130} height={23} />
      </Box>
      {/* ------------------------------------------------------------------------------------------------------ */}
      <Box className='overflow-hidden rounded-[0.5rem] border shadow m-5'>
        <Box className='flex-col md:flex'>
          {/* MainNavigation component */}
          <Box className='border-b'>
            <Box className='flex h-16 items-center px-4'>
              <MainNavigation className='mx-6' />
              {/* MainNavigation component */}
              <Box className='ml-auto flex items-center space-x-4'>
                <Typography variant={"h6"} fontWeight={500} marginRight={"5px"}>
                  {capitalizeFirstLetter(targetClient)}
                </Typography>
                <UserNavigation targetClient={targetClient} />
              </Box>
              {/* ------------------------------------------------------------------------------------------------------ */}
            </Box>
          </Box>
          {/* ------------------------------------------------------------------------------------------------------ */}
          <Box className='min-h-[78vh]'>{children}</Box>
        </Box>
      </Box>
      <Box className={'flex justify-between items-center m-5 text-slate-500'}>
        <Link href='mailto:dima.dimenko@assisterr.xyz'>support: dima.dimenko@assisterr.xyz</Link>
        <p>assisterr v1.05</p>
      </Box>
    </Box>
  );
}
