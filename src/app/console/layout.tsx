"use client";

import MenuItem from "@/components/MenuItem";
import { borderColor, textSecondaryColor } from "@/themes/colors";
import { loginCheckHandler } from "@/utils/auth";
import { capitalizeFirstLetter } from "@/utils/general";
import { navigationHandler } from "@/utils/nav";
import { Box, Typography } from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { ReactElement, useEffect, useState } from "react";

// this layout is rendered for all pages navigation under the "/console"
export default function ConsoleLayout({ children }: { children: ReactElement }): ReactElement {
  const router: AppRouterInstance = useRouter();

  // we initialize the selectedMenuItem state to "Dashboard" because that's the default page that will be shown when the user first logs in
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("Dashboard");
  const [targetClient, setTargetClient] = useState<string>("");

  function selectMenuItemHandler(selectedMenuItem: string): void {
    setSelectedMenuItem(selectedMenuItem);
  }

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
    <Box display={"flex"} justifyContent={"flex-start"} alignItems={"flex-start"} width={"100%"}>
      {/* left-side vertical bar */}
      <Box
        height={"100vh"}
        display={"flex"}
        flexDirection={"column"}
        sx={{
          borderRight: 2,
          borderColor: borderColor,
        }}
      >
        {/* ---------------------------------------------------------------------------------------------------------------- */}
        {/* assisterr logs section */}
        <Box marginTop={"40px"} marginX={"35px"}>
          <Image src={"/imgs/assisterr.png"} width={150} height={30} alt='assisterr logos' quality={100} />
        </Box>
        {/* ---------------------------------------------------------------------------------------------------------------- */}
        {/* assisterr logs section */}
        <Box>
          <Typography variant={"h6"} marginX={"35px"} marginTop={"20px"} marginBottom={"10px"} textAlign={"center"}>
            {capitalizeFirstLetter(targetClient)}
          </Typography>
        </Box>

        {/* ---------------------------------------------------------------------------------------------------------------- */}
        {/* menu items section */}
        <Box display={"flex"} flexDirection={"column"} marginX={"10px"} paddingTop={"140px"} paddingBottom={"80px"} justifyContent={"space-between"} flexGrow={1}>
          {/* uppper menu items */}
          <Box>
            <MenuItem name={"Dashboard"} iconPath={"/logos/dashboard.png"} marginB='10px' selectedMenuItem={selectedMenuItem} selectMenuItemHandler={selectMenuItemHandler} />
            <MenuItem name={"Space"} iconPath={"/logos/space.png"} marginB='10px' selectedMenuItem={selectedMenuItem} selectMenuItemHandler={selectMenuItemHandler} />
            <MenuItem name={"Support"} iconPath={"/logos/support.png"} marginB='10px' selectedMenuItem={selectedMenuItem} selectMenuItemHandler={selectMenuItemHandler} />
          </Box>
          {/* lower menu items */}
          <Box>
            <MenuItem name={"Log out"} iconPath={"/logos/organization.png"} marginB='10px' selectedMenuItem={selectedMenuItem} selectMenuItemHandler={selectMenuItemHandler} />
          </Box>
        </Box>
      </Box>
      <>{children}</>
    </Box>
  );
}
