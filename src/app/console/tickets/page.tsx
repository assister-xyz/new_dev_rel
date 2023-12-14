"use client";

import React, {ReactElement, useEffect, useRef, useState} from "react";
import { Box, Typography } from "@mui/material";
import {DataTable} from "@/components/table/DataTable";
import {columns} from "@/components/table/Columns";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MessageCard from "@/components/MessageCard";
import CustomTextField from "@/components/CustomTextField";
import {
  DashBoardDataSchema,
  TicketMessagesSchema,
  TicketResponseMessagesSchema,
  TicketSchema, TicketSchemaWithoutMessages
} from "@/types/apiResponseSchema";
import {addTicketResponseMessageApi, getDashBoardDataApi, getTicketApi} from "@/apis/dashboardPage";
import {loginCheckHandler} from "@/utils/auth";
import {navigationHandler} from "@/utils/nav";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {useRouter} from "next/navigation";

export default function TicketsPage(): ReactElement {
  const router: AppRouterInstance = useRouter();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  // set initial state
  const [selectedSource, setSelectedSource] = useState<string>("discord");
  const [targetTicketMessages, setTargetTicketMessages] = useState<TicketMessagesSchema[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  function scrollToBottom(): void {
    messagesContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function addTicketResponseMessageApiHandler(ticketId: string | undefined, message: string): Promise<void> {
    console.log("addTicketResponseMessageApiHandler runs");

    if (ticketId) {
      // senderType is always "admin" from dev rel app
      const responseMessage: TicketResponseMessagesSchema = {
        senderType: "admin",
        message: message,
        ticketId: ticketId,
      };

      try {
        // add response message to the target ticket
        const putResponse: Response = await addTicketResponseMessageApi(ticketId, responseMessage);
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

  async function getTicketApiHandler(ticketId: string): Promise<void> {
    try {
      const getResponse: Response = await getTicketApi(ticketId);
      if (getResponse.ok === false) {
        const responsePayload: { result: string } = await getResponse.json();
        throw new Error(responsePayload.result);
      }
      // when no error, we process response payload then parse it to update the target ticket messages state
      const responsePayload: { result: TicketSchema } = await getResponse.json();
      setTargetTicketMessages(responsePayload.result.messages);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  useEffect(() => {
    // fetching analytics data and tickets based on client and source (conduct when dashboard page is navigated to + when source is changed)
    async function getDashboardDataHandler(source: string, client: string): Promise<void> {
      console.log("getDashboardDataHandler runs");
      console.log("client:", client);

      try {
        const getResponse: Response = await getDashBoardDataApi(source, client);
        if (getResponse.ok === false) {
          const responsePayload: { result: string } = await getResponse.json();
          throw new Error(responsePayload.result);
        }
        // when no error, we process response payload then parse --> update all states using the response payload

        const responsePayload: { result: DashBoardDataSchema } = await getResponse.json();

        setTableData(responsePayload.result.source_open_tickets.map(ticket => {
          return {
            id: ticket.id,
            user: ticket.username,
            task: ticket.request,
            status: ticket.status
          }
        }))

      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }

    // this loginCheckHandler and if else will be conducted on every protected page route, so we can use this to check if client is logged in or not
    // we do not need to use state for managing client related data, it is all stored in localStorage, and we can access directly from there
    const authCheckResult: string = loginCheckHandler();
    if (authCheckResult === "unauthorized") {
      navigationHandler("/", router);
    } else {
      const clientName: string = localStorage.getItem("client")!;
      console.log("client:", clientName);
      getDashboardDataHandler(selectedSource, clientName);
    }
  }, [selectedSource]);

  useEffect(() => {
    scrollToBottom();
  }, [targetTicketMessages]);

  return (
    <Box className="flex-1 space-y-4 p-8 pt-6">
      <Box className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tickets</h2>
      </Box>
      <Box className='grid gap-4 grid-cols-3'>
        <Box className='col-span-2'>
          <DataTable  data={tableData} columns={columns} getTicketApiHandler={getTicketApiHandler}/>
        </Box>
        {/* Ticket response containers */}
        <Box width={"100%"}>
          <Box
            display={"flex"}
            sx={{
              border: 1,
              borderColor: '#1C1C1C1A',
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
            padding={"13px"}
          >
            <Box>
              <AccountCircleOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography marginLeft={"10px"}>Username</Typography>
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
              borderColor: '#1C1C1C1A',
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
