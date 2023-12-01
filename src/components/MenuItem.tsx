import { itemSelectedBgColor } from "@/themes/colors";
import { navigationHandler } from "@/utils/nav";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React, { ReactElement } from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function MenuItem({
  name,
  iconPath,
  selectedMenuItem,
  selectMenuItemHandler,
  marginB,
}: {
  name: string;
  iconPath: string;
  selectedMenuItem: string;
  selectMenuItemHandler: (targetMenuItem: string) => void;
  marginB: string;
}): ReactElement {
  const router: AppRouterInstance = useRouter();

  return (
    <Box
      display={"flex"}
      alignItems={"stretch"}
      justifyContent={"flex-start"}
      bgcolor={selectedMenuItem === name ? itemSelectedBgColor : "white"}
      paddingY={"5px"}
      borderRadius={"10px"}
      marginBottom={marginB}
      sx={{
        "&:hover": {
          cursor: "pointer",
          backgroundColor: itemSelectedBgColor,
        },
      }}
      onClick={() => {
        if (name !== "Log out") {
          selectMenuItemHandler(name);
          navigationHandler(`/console/${name.toLowerCase()}`, router);
        } else {
          localStorage.removeItem("client");
          navigationHandler("/", router);
        }
      }}
    >
      {selectedMenuItem === name ? <Box bgcolor={"black"} width={"5px"} borderRadius={"20px"} /> : <></>}
      <Box display={"flex"} alignItems={"center"} justifyContent={"flex-start"} marginLeft={"25px"}>
        <Image src={iconPath} width={25} height={25} alt='dashboard Icon' quality={100} />
        <Typography marginLeft={"5px"}>{name}</Typography>
      </Box>
    </Box>
  );
}
