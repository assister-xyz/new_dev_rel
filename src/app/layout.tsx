"use client";

import "./globals.css";
import React, { ReactElement } from "react";
import { StyledEngineProvider, ThemeProvider, createTheme } from "@mui/material";
import { customTypography } from "@/themes/typography";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }: { children: ReactElement }): ReactElement {
  const customTheme = createTheme({
    typography: customTypography,
  });

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <StyledEngineProvider>
      <ThemeProvider theme={customTheme}>
        <html lang='en'>
          <body suppressHydrationWarning={true}>
            {children}
            <Toaster />
          </body>
        </html>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
