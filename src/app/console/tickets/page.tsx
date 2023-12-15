"use client";

import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { DataTable } from "@/components/table/DataTable";
import { columns } from "@/components/table/Columns";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MessageCard from "@/components/MessageCard";
import CustomTextField from "@/components/CustomTextField";
import { TicketMessagesSchema, TicketResponseMessagesSchema, TicketSchema, TicketSchemaWithoutMessages } from "@/types/apiResponseSchema";
import { addTicketResponseMessageApi, getOpenTicketsByPageApi, getTicketApi, updateTicketStatusApi } from "@/apis/ticketPage";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { borderColor } from "@/themes/colors";

export default function TicketsPage(): ReactElement {
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const [selectedSource, setSelectedSource] = useState<string>("discord");
  const [ticketUsername, setTicketUsername] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const [targetTicketMessages, setTargetTicketMessages] = useState<TicketMessagesSchema[]>([]);
  const [tableData, setTableData] = useState<{ id: string; user: string; task: string; status: string }[]>([]);

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
          responsePayload.result.page_tickets.map((ticket: TicketSchemaWithoutMessages) => {
            return {
              id: ticket.id,
              user: ticket.username,
              task: ticket.request,
              status: ticket.status,
            };
          })
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
          responsePayload.result.page_tickets.map((ticket: TicketSchemaWithoutMessages) => {
            return {
              id: ticket.id,
              user: ticket.username,
              task: ticket.request,
              status: ticket.status,
            };
          })
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

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <Box className='flex-1 space-y-4 p-8 pt-6'>
      <Box className='flex items-center justify-between space-y-2'>
        <h2 className='text-3xl font-bold tracking-tight'>Tickets</h2>
      </Box>
      <Box className='grid gap-4 grid-cols-3'>
        <Box className='col-span-2'>
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

          <DataTable data={tableData} columns={columns} getTicketApiHandler={getTicketApiHandler} />

          <Box display={"flex"} justifyContent={"flex-end"} marginTop={"20px"} alignItems={"center"}>
            <Box
              onClick={goToPreviousPageHandler}
              padding={"4px 10px 7px 10px"}
              border={2}
              borderRadius={"10px"}
              borderColor={borderColor}
              marginRight={"15px"}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#F1F5F9",
                },
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: "16px" }} />
            </Box>
            <Typography variant='h6'>
              Page {totalPage !== 0 ? currentPage : 0} of {totalPage}
            </Typography>
            <Box
              onClick={goToNextPageHandler}
              padding={"4px 10px 7px 10px"}
              border={2}
              borderRadius={"10px"}
              borderColor={borderColor}
              marginLeft={"15px"}
              sx={{
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#F1F5F9",
                },
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: "16px" }} />
            </Box>
          </Box>
        </Box>
        {/* Ticket response containers */}
        <Box width={"100%"}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            sx={{
              border: 1,
              borderColor: "#1C1C1C1A",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
            padding={"13px"}
          >
            <Box display={"flex"}>
              <AccountCircleOutlinedIcon sx={{ fontSize: 20 }} />
              <Typography marginLeft={"10px"}>{ticketUsername}</Typography>
            </Box>
            {targetTicketMessages.length === 0 ? (
              <></>
            ) : (
              <Box
                paddingX={"15px"}
                paddingY={"5px"}
                bgcolor={"black"}
                borderRadius={"10px"}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    opacity: "0.8",
                  },
                }}
                onClick={() => updateTicketStatusApiHandler(targetTicketMessages[0]?.ticketId, "closed", selectedSource, currentPage)}
              >
                <Typography color={"white"}>Close Ticket</Typography>
              </Box>
            )}
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            sx={{
              height: "calc(100vh - 490px)",
              border: 1,
              borderTop: 0,
              borderBottomRightRadius: "8px",
              borderBottomLeftRadius: "8px",
              borderColor: "#1C1C1C1A",
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
