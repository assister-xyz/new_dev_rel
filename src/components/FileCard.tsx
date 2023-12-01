import { docCardColor, textSecondaryColor, warningColor } from "@/themes/colors";
import { Box, Typography } from "@mui/material";
import React, { ReactElement } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { FileCardPropsInterface } from "@/types/componentProps";

export default function FileCard({ client, fileName, id, createdDate, deleteTargetFileHandler }: FileCardPropsInterface): ReactElement {
  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{
        padding: 2,
        margin: 1,
        borderRadius: "15px",
      }}
      bgcolor={docCardColor}
    >
      <Box>
        <Typography variant='h6'>{fileName}</Typography>
        <Typography variant='body2' color={textSecondaryColor}>
          {createdDate}
        </Typography>
      </Box>
      <Box
        onClick={() => {
          deleteTargetFileHandler(id, client);
        }}
        sx={{
          "&:hover": {
            opacity: 0.8,
            cursor: "pointer",
          },
        }}
      >
        <DeleteIcon sx={{ color: warningColor }} />
      </Box>
    </Box>
  );
}
