"use client";

import { loginApi } from "@/apis/authPage";
import { majorCardBgColor, textSecondaryColor } from "@/themes/colors";
import { navigationHandler } from "@/utils/nav";
import { Box, TextField, Typography } from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactElement, useEffect, useState } from "react";

export default function AuthPage(): ReactElement {
  const router: AppRouterInstance = useRouter();
  const [clientCredentials, setClientCredentials] = useState<{ clientName: string; passcode: string }>({ clientName: "", passcode: "" });

  // ------------------------------------------------------------------------------------------------------------------------------------------------

  function setClientCredentialsHandler(event: React.ChangeEvent<HTMLInputElement>): void {
    setClientCredentials((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function onSubmitHandler(event: React.FormEvent): Promise<void> {
    event.preventDefault();

    try {
      const postResponse = await loginApi(clientCredentials);
      if (postResponse.ok === false) {
        const responsePayload: { result: string } = await postResponse.json();
        throw new Error(responsePayload.result);
      }
      // if login is successful we will store the client name in localStorage (value come from server) + navigate to dashboard after 500ms
      const responsePayload: { result: string } = await postResponse.json();
      if (responsePayload.result === "particle network") {
        localStorage.setItem("client", "particle");
      } else {
        localStorage.setItem("client", responsePayload.result);
      }

      // we then navigate to dashboard after 500ms
      setTimeout(() => {
        navigationHandler("/console/dashboard", router);
      }, 500);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    // if client is already logged in (if client name is stored in localstorage), we redirect him to the dashboard page directly by skipping the login page
    if (localStorage.getItem("client")) {
      navigationHandler("/console/dashboard", router);
    }
  }, []);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <Box width={"100%"} height={"100vh"} position={"relative"}>
      <Box
        display={"flex"}
        justifyContent={"center"}
        width={"100%"}
        sx={{
          zIndex: -1,
          position: "absolute",
          top: 0,
          left: 25,
        }}
      >
        <Box
          sx={{
            backgroundImage: "url('/imgs/home_background_pic.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "60%",
            height: "30vh",
          }}
        />
      </Box>

      {/* Wrap the typography in another Box and apply marginTop */}
      <Box display={"flex"} justifyContent={"center"} zIndex={1}>
        <Box marginTop={"25vh"} width={"50%"} display={"flex"} justifyContent={"center"}>
          <Box width={"100%"} bgcolor={majorCardBgColor} borderRadius={"15px"}>
            <Box display={"flex"} justifyContent={"center"} marginTop={"70px"}>
              <Image src={"/imgs/assisterr.png"} width={200} height={40} alt='assisterr logos' quality={100} />
            </Box>

            <Typography textAlign={"center"} variant='h1' marginBottom={"10px"} marginTop={"40px"}>
              Log in
            </Typography>
            <Typography textAlign={"center"} variant='body1' color={textSecondaryColor} marginBottom={"50px"}>
              Log into your client account
            </Typography>

            <Box paddingX={"200px"} component={"form"} onSubmit={onSubmitHandler}>
              <TextField
                required
                type='text'
                fullWidth
                onChange={setClientCredentialsHandler}
                name='clientName'
                value={clientCredentials.clientName}
                placeholder='Enter your client name'
                InputProps={{
                  sx: {
                    marginBottom: "25px",
                    borderRadius: "15px", // Adjust border radius as per the screenshot
                  },
                }}
              />
              <TextField
                required
                fullWidth
                type='password'
                onChange={setClientCredentialsHandler}
                name='passcode'
                value={clientCredentials.passcode}
                placeholder='Enter your passcode'
                InputProps={{
                  sx: {
                    marginBottom: "50px",
                    borderRadius: "15px", // Adjust border radius as per the screenshot
                  },
                }}
              />
              <Box component={"button"} type='submit' width={"100%"}>
                <Typography
                  padding={"10px"}
                  borderRadius={"15px"}
                  border={"none"}
                  marginBottom={"70px"}
                  variant='h3'
                  textAlign={"center"}
                  color={"white"}
                  bgcolor={"black"}
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                      opacity: 0.8,
                    },
                  }}
                >
                  Authenticate
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
