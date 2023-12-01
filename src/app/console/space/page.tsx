"use client";

import DocCard from "@/components/FileCard";
import { majorCardBgColor } from "@/themes/colors";
import { loginCheckHandler } from "@/utils/auth";
import { navigationHandler } from "@/utils/nav";
import { Box, Grid, Typography } from "@mui/material";
import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { EmbeddedFileStatesInterface } from "@/types/states";
import { deleteEmbeddedFileApi, embeddAndStoreFileApi, getEmbeddedFilesApi } from "@/apis/spacePage";
import FileCard from "@/components/FileCard";

export default function SpacePage(): ReactElement {
  const router: AppRouterInstance = useRouter();

  const [selectedFile, setSelectedFileFile] = useState<File | null>(null);
  const [isFileTypeError, setIsFileTypeError] = useState<boolean>(false);
  const [filesData, setFilesData] = useState<EmbeddedFileStatesInterface[]>([]);

  // -----------------------------------------------------------------------------------------------------------------

  function selectFileHandler(event: ChangeEvent<HTMLInputElement>): void {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const fileExtension: string = selectedFile.name.split(".").pop()!.toLowerCase();
      if (!["pdf", "txt"].includes(fileExtension)) {
        setIsFileTypeError(true);
      } else {
        // file name already contains the file extension in it as a whole string
        console.log("selectedFileName:", selectedFile.name);
        setIsFileTypeError(false);
        setSelectedFileFile(selectedFile);
      }
    }
  }

  async function uploadAndEmbedFileHandler(): Promise<void> {
    console.log("uploadAndEmbedFileHandler runs");

    if (selectedFile) {
      try {
        const fileType: string = selectedFile.name.split(".").pop()!.toLowerCase();
        const fileName: string = selectedFile.name;

        const client: string = localStorage.getItem("client")!;

        const postResponse: Response = await embeddAndStoreFileApi({ selectedFile, fileType, client });
        if (postResponse.ok === false) {
          const responsePayload: { result: string } = await postResponse.json();
          throw new Error(responsePayload.result);
        }

        setSelectedFileFile(null);
        setIsFileTypeError(false);

        const getResponse: Response = await getEmbeddedFilesApi(client);
        if (getResponse.ok === false) {
          const responsePayload: { result: string } = await getResponse.json();
          throw new Error(responsePayload.result);
        }

        const responsePayload: { result: EmbeddedFileStatesInterface[] } = await getResponse.json();
        setFilesData(responsePayload.result);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }
  }

  async function deleteTargetFileHandler(id: string, client: string): Promise<void> {
    console.log("deleteTargetFileHandler runs");

    try {
      const deleteResponse: Response = await deleteEmbeddedFileApi(id);
      if (deleteResponse.ok === false) {
        const responsePayload: { result: string } = await deleteResponse.json();
        throw new Error(responsePayload.result);
      }

      const getResponse: Response = await getEmbeddedFilesApi(client);
      if (getResponse.ok === false) {
        const responsePayload: { result: string } = await getResponse.json();
        throw new Error(responsePayload.result);
      }

      const responsePayload: { result: EmbeddedFileStatesInterface[] } = await getResponse.json();
      setFilesData(responsePayload.result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  // -----------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    async function getEmbeddedFilesOnNav(client: string): Promise<void> {
      console.log("getEmbeddedFilesOnNav runs");

      try {
        const getResponse: Response = await getEmbeddedFilesApi(client);
        if (getResponse.ok === false) {
          const responsePayload: { result: string } = await getResponse.json();
          throw new Error(responsePayload.result);
        }

        const responsePayload: { result: EmbeddedFileStatesInterface[] } = await getResponse.json();
        setFilesData(responsePayload.result);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }

    const authCheckResult: string = loginCheckHandler();
    if (authCheckResult === "unauthorized") {
      navigationHandler("/", router);
    } else {
      const clientName: string = localStorage.getItem("client")!;
      getEmbeddedFilesOnNav(clientName);
    }
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <Box width={"100%"} paddingTop={"50px"} paddingBottom={"30px"} paddingX={"120px"} height={"100vh"} display={"flex"} flexDirection={"column"}>
      <Typography fontSize={"16px"} marginBottom={"50px"}>
        Space allows you to manage your knowledge base for your community to query and ask questions
      </Typography>

      {/* ------------------------------------------------------------------------------------------------------------------------------------- */}

      <Box width={"950px"} bgcolor={majorCardBgColor} borderRadius={"15px"} paddingX={"40px"} paddingY={"20px"}>
        <Box display={"flex"} justifyContent={"start"} alignItems={"center"}>
          <Typography variant='h6'>Knowledge Base</Typography>
          <Box marginLeft={"20px"}>
            <input style={{ display: "none" }} id='file-upload' multiple type='file' onChange={selectFileHandler} />
            <label htmlFor='file-upload'>
              <Box
                bgcolor={"#F4E5DB"}
                borderRadius={"15px"}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "#E6D6CC",
                  },
                }}
              >
                <Typography paddingX={"10px"} paddingY={"5px"}>
                  Select File
                </Typography>
              </Box>
            </label>
          </Box>
        </Box>

        {/* ---------------------------------------------------------------------------------------------------------------------------------------- */}

        <Box marginTop={"15px"}>
          {isFileTypeError ? (
            <Typography fontWeight={"medium"} color={"red"}>
              The file type is not accepted, please upload one of the followings: pdf, txt (more coming soon)
            </Typography>
          ) : selectedFile ? (
            <Box display={"flex"} justifyContent={"flex-start"} alignItems={"center"}>
              <Typography fontWeight={"medium"}>Selected file: {selectedFile.name}</Typography>
              <Box
                onClick={uploadAndEmbedFileHandler}
                marginLeft={"20px"}
                bgcolor={"#F4E5DB"}
                borderRadius={"15px"}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: "#E6D6CC",
                  },
                }}
              >
                <Typography paddingX={"10px"} paddingY={"5px"}>
                  Upload & Embed Doc
                </Typography>
              </Box>
            </Box>
          ) : (
            <></>
          )}
        </Box>

        {/* -------------------------------------------------------------------------------------------------------------------------------------------- */}
        {/* existing added & embedded docs */}

        <Box
          marginTop={"20px"}
          flexGrow={1}
          width={"100%"}
          sx={{
            // the ticket box container height is dynamically calculated hard set based on PX value, this is to make the box scrollable
            height: "50vh",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555",
            },
          }}
        >
          <Grid container spacing={2}>
            {filesData.map((file: EmbeddedFileStatesInterface, index: number) => (
              <Grid item xs={12} sm={6} key={index}>
                <FileCard {...file} deleteTargetFileHandler={deleteTargetFileHandler} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
