import { cardSelectedBgColor } from "@/themes/colors";
import { StatsCardPropsInterface } from "@/types/componentProps";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React, { ReactElement } from "react";

export default function StatsCard({ statsName, statsIcon, value, percentChange }: StatsCardPropsInterface): ReactElement {
  return (
    <Box width={"210px"} bgcolor={cardSelectedBgColor} borderRadius={"15px"} paddingX={"20px"} paddingY={"25px"} marginRight={"35px"}>
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography variant='h6' fontWeight={"medium"}>
          {statsName}
        </Typography>
        <Image src={statsIcon} width={22} height={20} alt='stats icon' quality={100} />
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} marginTop={"20px"}>
        <Typography variant='h1' fontWeight={"bold"}>
          {value}
        </Typography>
        <Box display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
          <Typography variant='body2' marginRight={"5px"}>
            {percentChange}
          </Typography>
          <Image src={"/logos/stats_up.png"} width={20} height={20} alt='trend icon' quality={100} />
        </Box>
      </Box>
    </Box>
  );
}
