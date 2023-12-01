import { itemSelectedBgColor, textSecondaryColor } from "@/themes/colors";
import { Box, Typography } from "@mui/material";
import React, { ReactElement } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { TicketSchemaWithoutMessages } from "@/types/apiResponseSchema";

export default function TicketItem({
  ticket,
  getTicketApiHandler,
}: {
  ticket: TicketSchemaWithoutMessages;
  getTicketApiHandler: (ticketId: string) => Promise<void>;
}): ReactElement {
  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"flex-start"}
      padding={"15px"}
      sx={{
        "&:hover": {
          backgroundColor: itemSelectedBgColor,
          cursor: "pointer",
        },
      }}
      onClick={() => {
        getTicketApiHandler(ticket.id);
      }}
    >
      <Box display={"flex"} justifyContent={"flex-start"} alignItems={"flex-start"}>
        <Box paddingTop={"3px"}>
          <AccountCircleOutlinedIcon sx={{ fontSize: 20 }} />
        </Box>
        <Box marginLeft={"10px"}>
          <Typography fontWeight={"medium"}>{ticket.username}</Typography>
          <Typography variant={"body2"} width={"85%"}>
            {ticket.request}
          </Typography>
        </Box>
      </Box>
      <Typography variant={"body2"} color={textSecondaryColor}>
        {ticket.createdDate}
      </Typography>
    </Box>
  );
}
