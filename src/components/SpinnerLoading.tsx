import { primaryThemeColor, secondaryThemeColor } from "@/themes/colors";
import { Box } from "@mui/material";
import React, { ReactElement } from "react";

export default function SpinnerLoading({ width, height, border }: { width: string; height: string; border: number }): ReactElement {
  return (
    <Box
      width={width}
      height={height}
      border={border}
      borderColor={secondaryThemeColor}
      borderRadius={"50%"}
      sx={{
        borderTopColor: primaryThemeColor,
        animation: "spin 1s linear infinite",
        "@keyframes spin": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
      }}
    />
  );
}
