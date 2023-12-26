"use client";

import React, { ReactElement, useEffect, useRef, useState } from "react";
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Box, Typography } from "@mui/material";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/Columns";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MessageCard from "@/components/MessageCard";
import CustomTextField from "@/components/CustomTextField";
import { TicketMessagesSchema, TicketResponseMessagesSchema, TicketSchema, TicketSchemaWithoutMessages } from "@/types/apiResponseSchema";
import { addTicketResponseMessageApi, getOpenTicketsByPageApi, getTicketApi, updateTicketStatusApi } from "@/apis/ticketPage";
import {Button} from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import Image from "next/image";

export default function TicketsPage(): ReactElement {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [code, setCode] = useState(`
    import os
    import openai
    
    openai.api_key = os.getenv("OPENAI_API_KEY")
    
    response = openai.Completion.create(
      model="davinci",
      prompt="",
      temperature=0.9,
      max_tokens=5,
      top_p=1,  
      frequency_penalty=0,
      presence_penalty=0,
    )               
  `);

  const [selectedSource, setSelectedSource] = useState<string>("discord");
  const [selectedTicket, setSelectedTicket] = useState<TicketSchemaWithoutMessages | null>(null);
  const [ticketUsername, setTicketUsername] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const [targetTicketMessages, setTargetTicketMessages] = useState<TicketMessagesSchema[]>([]);
  const [tableData, setTableData] = useState<TicketSchemaWithoutMessages[]>([]);

  // ----------------------------------------------------------------------------------------------------------------------------
  function setTicketUsernameHandler(username: string): void {
    setTicketUsername(username);
  }

  function goToNextPageHandler(): void {
    if (currentPage < totalPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }

  function goToPreviousPageHandler(): void {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  }

  function setSelectedSourceHandler(targetSource: string): void {
    setSelectedSource(targetSource);
    setCurrentPage(1);
  }

  function scrollToBottom(): void {
    messagesContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function addTicketResponseMessageApiHandler(ticketId: string | undefined, messageContent: string): Promise<void> {
    console.log("addTicketResponseMessageApiHandler runs");

    if (ticketId) {
      // senderType is always "admin" from dev rel app
      const adminResponse: TicketResponseMessagesSchema = {
        senderType: "admin",
        message: messageContent,
        ticketId: ticketId,
      };

      try {
        // add response message to the target ticket
        const putResponse: Response = await addTicketResponseMessageApi(ticketId, adminResponse);
        // response.ok is a shorthand property that returns a boolean indicating whether the response was successful (true, 200-299 it indicates a successful response | false is not successful)
        if (putResponse.ok === false) {
          const responsePayload: { result: string } = await putResponse.json();
          throw new Error(responsePayload.result);
        }

        // ---------------------------------------------------------------------------------------------
        // when no error, we will fetch the updated target ticket object again and set new ticket messages state
        const getResponse: Response = await getTicketApi(ticketId);

        if (getResponse.ok === false) {
          const responsePayload: { result: string } = await getResponse.json();
          throw new Error(responsePayload.result);
        }

        const responsePayload: { result: TicketSchema } = await getResponse.json();
        setTargetTicketMessages(responsePayload.result.messages);
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }
  }

  async function updateTicketStatusApiHandler(ticketId: string, status: string, source: string, page: number): Promise<void> {
    try {
      const putResponse: Response = await updateTicketStatusApi(ticketId, status);
      if (putResponse.ok === false) {
        const responsePayload: { result: string } = await putResponse.json();
        throw new Error(responsePayload.result);
      }

      setTargetTicketMessages([]);

      const clientName: string | null = localStorage.getItem("client");
      if (clientName) {
        const getResponse: Response = await getOpenTicketsByPageApi(source, clientName, page);
        if (getResponse.ok === false) {
          const responsePayload: { result: string } = await getResponse.json();
          throw new Error(responsePayload.result);
        }

        const responsePayload: { result: { page_tickets: TicketSchemaWithoutMessages[]; total_pages: number } } = await getResponse.json();

        setTotalPage(responsePayload.result.total_pages);
        setTableData(
          responsePayload.result.page_tickets
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  async function getTicketApiHandler(ticketId: string): Promise<void> {
    try {
      const getResponse: Response = await getTicketApi(ticketId);

      if (getResponse.ok === false) {
        const responsePayload: { result: string } = await getResponse.json();
        throw new Error(responsePayload.result);
      }
      // when no error, we process response payload then parse it to update the target ticket messages state
      const responsePayload: { result: TicketSchema } = await getResponse.json();
      setTicketUsernameHandler(responsePayload.result.username);
      setTargetTicketMessages(responsePayload.result.messages);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  useEffect(() => {
    async function getOpenTicketsByPageApiHandler(source: string, clientName: string, page: number): Promise<void> {
      console.log("getOpenTicketsByPageApiHandler runs");

      try {
        const getResponse: Response = await getOpenTicketsByPageApi(source, clientName, page);
        if (getResponse.ok === false) {
          const responsePayload: { result: string } = await getResponse.json();
          throw new Error(responsePayload.result);
        }

        const responsePayload: { result: { page_tickets: TicketSchemaWithoutMessages[]; total_pages: number } } = await getResponse.json();

        setTotalPage(responsePayload.result.total_pages);
        setTableData(
          responsePayload.result.page_tickets
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }

    const clientName: string | null = localStorage.getItem("client");
    if (clientName) {
      getOpenTicketsByPageApiHandler(selectedSource, clientName, currentPage);
    }
  }, [selectedSource, currentPage]);

  useEffect(() => {
    scrollToBottom();
  }, [targetTicketMessages]);
  useEffect(() => {
    console.log(selectedTicket)
  }, [selectedTicket]);



  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <Box className='flex-1 space-y-4 p-8 pt-6'>
      <Box className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Tickets</h2>
      </Box>
      <Box className='grid gap-4 grid-cols-4'>
        <Box className='col-span-2'>
          {/* ---------------------------------------------------------------------------------------------------------------------------------------- */}
          {/* ticket source selector */}
          <Box display={"flex"} marginBottom={"15px"}>
            <Box
              onClick={() => setSelectedSourceHandler("discord")}
              paddingX={"15px"}
              paddingY={"10px"}
              bgcolor={selectedSource === "discord" ? "black" : ""}
              borderRadius={"15px"}
              border={1}
              display={"inline-block"}
              marginRight={"15px"}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                  opacity: "0.8",
                },
              }}
            >
              <Typography variant='h6' color={selectedSource === "discord" ? "white" : "black"} component={"span"}>
                Discord
              </Typography>
            </Box>
            <Box
              onClick={() => setSelectedSourceHandler("telegram")}
              paddingX={"15px"}
              paddingY={"10px"}
              bgcolor={selectedSource === "telegram" ? "black" : ""}
              borderRadius={"15px"}
              border={1}
              display={"inline-block"}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                  opacity: "0.8",
                },
              }}
            >
              <Typography variant='h6' color={selectedSource === "telegram" ? "white" : "black"} component={"span"}>
                Telegram
              </Typography>
            </Box>
          </Box>

          {/* -------------------------------------------------------------------------------------------------------------------------------------------- */}
          {/* tickets */}

          <DataTable
            data={tableData}
            columns={columns}
            getTicketApiHandler={getTicketApiHandler}
            goToPreviousPageHandler={goToPreviousPageHandler}
            goToNextPageHandler={goToNextPageHandler}
            setSelectedTicket={setSelectedTicket}
          />

          {/* -------------------------------------------------------------------------------------------------------------------------------------------- */}
          {/* ticket page navigation handle */}

        </Box>
        {/* Ticket response containers */}
        <Box width={"100%"} className='col-span-2 mt-[59px]'>
          <Box
            className={`rounded-t-md border border-input`}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            padding={"13px"}
          >
            <Box display={"flex"}>
              {
                selectedTicket
                ? <Image src={selectedTicket.avatar} alt={'avatar'}  width={24} height={24} className={'rounded-full'}/>
                : <AccountCircleOutlinedIcon sx={{ fontSize: 20 }} />
              }
              <Typography marginLeft={"10px"}>{ticketUsername}</Typography>
            </Box>

            {targetTicketMessages.length !== 0 &&
              <Box className='flex items-center'>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size='xs'
                      className='mr-2'
                    >
                      Add to Knowledge Base
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                      <DialogTitle>Add to Knowledge Base</DialogTitle>
                      <DialogDescription>
                        Please check content before adding to Knowledge Base. New data source will be in added as separated txt file.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <CodeEditor
                        value={code}
                        language="js"
                        placeholder="Please enter JS code."
                        onChange={(evn) => setCode(evn.target.value)}
                        padding={15}
                        style={{
                          borderRadius: '6px',
                          backgroundColor: "#000000",
                          fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                          overflowY: 'scroll',
                          height: 280,
                        }}
                      />
                      <div>
                        <Label htmlFor="username" className="text-right">
                          Doc Name
                        </Label>
                        <Input
                          id="taskName"
                          placeholder={'ticket #12412'}
                        />
                      </div>
                    </div>
                    <DialogFooter className='sm:justify-start'>
                      <Button type="submit">Save</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                    >
                      <DotsHorizontalIcon className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                      onClick={() => updateTicketStatusApiHandler(targetTicketMessages[0]?.ticketId, "open", selectedSource, currentPage)}
                    >
                      Open
                      {
                        selectedTicket?.status === 'open' && <CheckIcon/>
                      }
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateTicketStatusApiHandler(targetTicketMessages[0]?.ticketId, "in progress", selectedSource, currentPage)}
                    >
                      In Progress
                      {
                        selectedTicket?.status === 'in progress' && <CheckIcon/>
                      }
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateTicketStatusApiHandler(targetTicketMessages[0]?.ticketId, "closed", selectedSource, currentPage)}
                    >
                      Closed
                      {
                        selectedTicket?.status === 'closed' && <CheckIcon/>
                      }
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateTicketStatusApiHandler(targetTicketMessages[0]?.ticketId, "other", selectedSource, currentPage)}
                    >
                      Other
                      {
                        selectedTicket?.status === 'other' && <CheckIcon/>
                      }
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Box>
            }
          </Box>
          <Box
            className={`rounded-b-md border border-input border-t-0`}
            display={"flex"}
            flexDirection={"column"}
            sx={{
              height: "calc(100vh - 490px)",
            }}
          >
            <Box
              height={"calc(100vh - 540px)"}
              padding={"15px"}
              sx={{
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
              {/* all message boxes */}
              {targetTicketMessages.map((message: TicketMessagesSchema, index: number) => {
                return <MessageCard key={index} message={message} />;
              })}
              <div ref={messagesContainerRef} />
            </Box>
            <Box flexGrow={1} padding={"10px"} width={"100%"}>
              <CustomTextField addTicketResponseMessageApiHandler={addTicketResponseMessageApiHandler} ticketId={targetTicketMessages[0]?.ticketId} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
