import { greenLightColor, cardSelectedBgColor, textSecondaryColor, cardBgColor } from "@/themes/colors";
import { SourceBotCardPropsInterface } from "@/types/componentProps";
import { capitalizeFirstLetter } from "@/utils/general";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React, { ReactElement } from "react";

export default function SourceBotCard({
  sourceIcon,
  sourceName,
  lastQueryDatetime,
  isOnline,
  selectedSource,
  openTicketsCount,
  selectSourceHandler,
}: SourceBotCardPropsInterface): ReactElement {
  return (
    <Box
      width={"292px"}
      bgcolor={selectedSource === sourceName ? cardSelectedBgColor : cardBgColor}
      borderRadius={"15px"}
      paddingX={"20px"}
      paddingTop={"30px"}
      paddingBottom={"15px"}
      marginRight={"35px"}
      sx={{
        "&:hover": {
          cursor: "pointer",
        },
      }}
      onClick={() => selectSourceHandler(sourceName)}
    >
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography variant='h6' fontWeight={"medium"}>
          {capitalizeFirstLetter(sourceName)}
        </Typography>
        <Image src={sourceIcon} width={24} height={24} alt='chatbot icon' quality={100} />
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} marginTop={"20px"}>
        <Typography variant='body2' color={textSecondaryColor}>
          Last Query: {lastQueryDatetime}
        </Typography>
        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
          <Box borderRadius={"50%"} width={8} height={8} bgcolor={greenLightColor} />
          <Typography variant='body2' color={greenLightColor} marginLeft={"5px"}>
            {isOnline ? "Online" : "Offline"}
          </Typography>
        </Box>
      </Box>
      <Box display={"flex"} justifyContent={"flex-end"} alignItems={"center"} marginTop={"20px"}>
        <Typography variant='body2'>Open Ticket: </Typography>
        <Typography variant='body2' fontWeight={"bold"} marginLeft={"5px"}>
          {openTicketsCount}
        </Typography>
      </Box>
    </Box>
  );
}
