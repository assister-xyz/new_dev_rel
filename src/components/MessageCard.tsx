import { messageBubbleBgColor } from "@/themes/colors";
import { TicketMessagesSchema } from "@/types/apiResponseSchema";
import { Box, Typography } from "@mui/material";
import React, { ReactElement } from "react";

export default function MessageCard({ message }: { message: TicketMessagesSchema }): ReactElement {
  return (
    <Box display={"flex"} marginBottom={"15px"} justifyContent={message.senderType === "user" ? "flex-start" : "flex-end"}>
      <Typography
        width={"75%"}
        bgcolor={messageBubbleBgColor}
        padding={"20px"}
        borderRadius={"15px"}
        sx={{
          wordWrap: "break-word",
          wordBreak: "break-all",
        }}
      >
        {message.message}
      </Typography>
    </Box>
  );
}
