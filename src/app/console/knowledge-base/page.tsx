"use client";

import { greenLightColor, redLightColor } from "@/themes/colors";
import { Box } from "@mui/material";
import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import Image from "next/image";
import { EmbeddedFileStatesInterface, SourceBotCardStatesInterface } from "@/types/states";
import { deleteEmbeddedFileApi, embeddAndStoreFileApi, getEmbeddedFileRefsApi } from "@/apis/knowledgePage";
import FileCard from "@/components/FileCard";
import AddFileCard from "@/components/AddFileCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function KnowledgeBasePage(): ReactElement {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileTypeError, setIsFileTypeError] = useState<boolean>(false);
  const [filesData, setFilesData] = useState<EmbeddedFileStatesInterface[]>([]);
  const [discordBotCardStates, setDiscordBotCardStates] = useState<SourceBotCardStatesInterface>({
    lastQueryDatetime: "--",
    isOnline: false,
    openTicketsCount: "--",
  });

  const [telegramBotCardStates, setTelegramBotCardStates] = useState<SourceBotCardStatesInterface>({
    lastQueryDatetime: "--",
    isOnline: false,
    openTicketsCount: "--",
  });

  const [mainSiteBotCardStates, setMainSiteBotCardStates] = useState<SourceBotCardStatesInterface>({
    lastQueryDatetime: "--",
    isOnline: false,
    openTicketsCount: "--",
  });

  // -----------------------------------------------------------------------------------------------------------------

  function selectFileHandler(event: ChangeEvent<HTMLInputElement>): void {
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile)
    if (selectedFile) {
      const fileExtension: string = selectedFile.name.split(".").pop()!.toLowerCase();
      if (!["pdf", "txt"].includes(fileExtension)) {
        setIsFileTypeError(true);
        setSelectedFile(null)
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: 'Sorry, but we only accept files in TXT or PDF format. The file you attempted to upload is not supported. Please make sure you are uploading a valid TXT or PDF file and try again.',
        })
      } else {
        // file name already contains the file extension in it as a whole string
        console.log("selectedFileName:", selectedFile.name);
        setIsFileTypeError(false);
        setSelectedFile(selectedFile);
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

        setSelectedFile(null);
        setIsFileTypeError(false);

        const getResponse: Response = await getEmbeddedFileRefsApi(client);
        if (getResponse.ok === false) {
          const responsePayload: { result: string } = await getResponse.json();
          throw new Error(responsePayload.result);
        }

        const responsePayload: { result: EmbeddedFileStatesInterface[] } = await getResponse.json();
        setFilesData(responsePayload.result);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message,
          })
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

      const getResponse: Response = await getEmbeddedFileRefsApi(client);
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
        const getResponse: Response = await getEmbeddedFileRefsApi(client);
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

    const clientName: string = localStorage.getItem("client")!;
    getEmbeddedFilesOnNav(clientName);
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <Box className='flex-1 space-y-4 p-8 pt-6'>
      <Box className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Knowledge Base</h2>
      </Box>
      <Box className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <AddFileCard fileName={selectedFile?.name} uploadAndEmbedFileHandler={uploadAndEmbedFileHandler} selectFileHandler={selectFileHandler} />
        {filesData.map((file: EmbeddedFileStatesInterface, index: number) => (
          <FileCard key={index} {...file} deleteTargetFileHandler={deleteTargetFileHandler} />
        ))}
      </Box>
      <Box className='grid gap-6 grid-cols-2'>
        <Card>
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="flex justify-between text-sm font-medium">
              Bot`s Performance
            </CardTitle>
            <CardDescription>1,042 queries were solved this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <Box className="grid gap-6">
              <Box className="flex items-center justify-between space-x-4">
                  <Image src='/logos/discord_circle.svg' alt='logo' width={40} height={40} />
                  <Box className='flex-1 ml-2'>
                    <p className="text-sm font-medium leading-none">
                      DS client
                    </p>
                    <p className="text-sm text-muted-foreground">queries</p>
                  </Box>
                  <p className="text-sm font-medium">
                    {discordBotCardStates.openTicketsCount} tickets
                  </p>
                  <li
                      style={{
                        color: discordBotCardStates.isOnline ? greenLightColor : redLightColor,
                      }}
                  >
                    {discordBotCardStates.isOnline ? 'online' : 'offline'}
                  </li>
              </Box>
              <Box className="flex items-center justify-between space-x-4">
                <Image src='/logos/telegram_circle.svg' alt='logo' width={40} height={40} />
                <Box className='flex-1 ml-2'>
                  <p className="text-sm font-medium leading-none">
                    TG client
                  </p>
                  <p className="text-sm text-muted-foreground">queries</p>
                </Box>
                <p className="text-sm font-medium">
                  {telegramBotCardStates.openTicketsCount} tickets
                </p>
                <li
                  style={{
                    color: telegramBotCardStates.isOnline ? greenLightColor : redLightColor,
                  }}
                >
                  {telegramBotCardStates.isOnline ? 'online' : 'offline'}
                </li>
              </Box>
              <Box className="flex items-center justify-between space-x-4">
                <Image src='/logos/web.svg' alt='logo' width={40} height={40} />
                <Box className='flex-1 ml-2'>
                  <p className="text-sm font-medium leading-none">
                    Main Site
                  </p>
                  <p className="text-sm text-muted-foreground">queries</p>
                </Box>
                <Button variant="secondary">Set Up</Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
