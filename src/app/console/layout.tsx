"use client";

import MenuItem from "@/components/MenuItem";
import { borderColor } from "@/themes/colors";
import { Box } from "@mui/material";
import Image from "next/image";
import React, { ReactElement, useState } from "react";

// this layout is rendered for all pages navigation under the "/console"
export default function ConsoleLayout({ children }: { children: ReactElement }): ReactElement {
  // we initialize the selectedMenuItem state to "Dashboard" because that's the default page that will be shown when the user first logs in
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("Dashboard");

  function selectMenuItemHandler(selectedMenuItem: string): void {
    setSelectedMenuItem(selectedMenuItem);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
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
