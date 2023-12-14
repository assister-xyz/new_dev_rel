"use client";

import { Box, Typography } from "@mui/material";
import React, { ReactElement, use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import StatsCard from "@/components/StatsCard";
import { borderColor, cardBgColor } from "@/themes/colors";
import TicketItem from "@/components/TicketItem";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CustomTextField from "@/components/CustomTextField";
import MessageCard from "@/components/MessageCard";
import SourceBotCard from "@/components/SourceBotCard";
import { addTicketResponseMessageApi, getDashBoardDataApi, getTicketApi } from "@/apis/dashboardPage";
import { DashBoardDataSchema, TicketMessagesSchema, TicketResponseMessagesSchema, TicketSchema, TicketSchemaWithoutMessages } from "@/types/apiResponseSchema";
import { SourceBotCardStatesInterface, StatsCardStatesInterface } from "@/types/states";
import { loginCheckHandler } from "@/utils/auth";
import { navigationHandler } from "@/utils/nav";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function DashboardPage(): ReactElement {
  const router: AppRouterInstance = useRouter();

  // use useRef to create a reference to the messages container, then use this reference to scroll to the bottom of the container
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // set initial state of client
  const [selectedSource, setSelectedSource]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("discord");
  // set the initial states for all cards, tickets, messages in this page
  const [ticketStatsCardStates, setTicketStatsCardStates] = useState<StatsCardStatesInterface>({ value: "--", percentChange: "--" });
  const [queryStatsCardStates, setQueryStatsCardStates] = useState<StatsCardStatesInterface>({ value: "--", percentChange: "--" });
  const [weeklyUserStatsCardStates, setWeeklyUserStatsCardStates] = useState<StatsCardStatesInterface>({ value: "--", percentChange: "--" });
  const [dailyUserStatsCardStates, setDailyUserStatsCardStates] = useState<StatsCardStatesInterface>({ value: "--", percentChange: "--" });

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

  const [sourceOpenTickets, setSourceOpenTickets] = useState<TicketSchemaWithoutMessages[]>([]);

  const [targetTicketMessages, setTargetTicketMessages] = useState<TicketMessagesSchema[]>([]);

  // --------------------------------------------------------------------------------------------------------------------

  function scrollToBottom(): void {
    messagesContainerRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function selectSourceHandler(targetSource: string): void {
    setSelectedSource(targetSource);
  }

  // this is where we add resposne message to the target ticket to update and then fetch the updated ticket messages again
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

  // get target ticket messages when specific ticket is selected by clicking on the target ticket item
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

  // ------------------------------------------------------------------------------------------------------------------------------------------------
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

        setTicketStatsCardStates({ value: responsePayload.result.source_total_tickets_count, percentChange: responsePayload.result.source_daily_tickets_percentage_change });
        setQueryStatsCardStates({ value: responsePayload.result.source_total_queries_count, percentChange: responsePayload.result.source_daily_queries_percentage_change });
        setWeeklyUserStatsCardStates({
          value: responsePayload.result.source_weekly_unique_user_count,
          percentChange: responsePayload.result.source_weekly_unique_user_percentage_change,
        });
        setDailyUserStatsCardStates({
          value: responsePayload.result.source_daily_unique_user_count,
          percentChange: responsePayload.result.source_daily_unique_user_percentage_change,
        });

        setDiscordBotCardStates({
          lastQueryDatetime: responsePayload.result.discord_most_recent_query_datetime,
          isOnline: true,
          openTicketsCount: responsePayload.result.discord_open_tickets_count,
        });

        setTelegramBotCardStates({
          lastQueryDatetime: responsePayload.result.telegram_most_recent_query_datetime,
          isOnline: true,
          openTicketsCount: responsePayload.result.telegram_open_tickets_count,
        });

        // set main site bot card states when this is available in the future

        setSourceOpenTickets(responsePayload.result.source_open_tickets);
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

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    // dashboard overall Box container
    <Box width={"100%"} paddingTop={"50px"} paddingBottom={"30px"} paddingX={"120px"} height={"100vh"} display={"flex"} flexDirection={"column"}>
      {/* -------------------------------------------------------------------------------------------------------------------- */}
      {/* top 4 stats cards container */}
      <Box display={"flex"} justifyContent={"flex-start"} alignItems={"flex-start"} marginBottom={"50px"}>
        <StatsCard statsName={"Tickets"} statsIcon={"/logos/tickets.png"} value={ticketStatsCardStates.value} percentChange={ticketStatsCardStates.percentChange} />
        <StatsCard statsName={"Queries"} statsIcon={"/logos/queries.png"} value={queryStatsCardStates.value} percentChange={queryStatsCardStates.percentChange} />
        <StatsCard statsName={"Users weekly"} statsIcon={"/logos/users.png"} value={weeklyUserStatsCardStates.value} percentChange={weeklyUserStatsCardStates.percentChange} />
        <StatsCard statsName={"User daily"} statsIcon={"/logos/users.png"} value={dailyUserStatsCardStates.value} percentChange={dailyUserStatsCardStates.percentChange} />
      </Box>
      {/* -------------------------------------------------------------------------------------------------------------------- */}
      {/* bottom 3 channel bot cards container */}
      <Box display={"flex"} justifyContent={"flex-start"} alignItems={"flex-start"} marginBottom={"50px"}>
        <SourceBotCard
          sourceIcon={"/logos/discord.png"}
          sourceName={"discord"}
          lastQueryDatetime={discordBotCardStates.lastQueryDatetime}
          isOnline={discordBotCardStates.isOnline}
          selectedSource={selectedSource}
          openTicketsCount={discordBotCardStates.openTicketsCount}
          selectSourceHandler={selectSourceHandler}
        />
        <SourceBotCard
          sourceIcon={"/logos/telegram.png"}
          sourceName={"telegram"}
          lastQueryDatetime={telegramBotCardStates.lastQueryDatetime}
          isOnline={telegramBotCardStates.isOnline}
          selectedSource={selectedSource}
          openTicketsCount={telegramBotCardStates.openTicketsCount}
          selectSourceHandler={selectSourceHandler}
        />
        <SourceBotCard
          sourceIcon={"/logos/main_site.png"}
          sourceName={"main site"}
          lastQueryDatetime={mainSiteBotCardStates.lastQueryDatetime}
          isOnline={mainSiteBotCardStates.isOnline}
          selectedSource={selectedSource}
          openTicketsCount={mainSiteBotCardStates.openTicketsCount}
          selectSourceHandler={selectSourceHandler}
        />
      </Box>
      {/* -------------------------------------------------------------------------------------------------------------------- */}
      {/* Ticket management container */}
      <Box display={"flex"} justifyContent={"flex-start"} alignItems={"flex-start"} flexGrow={1}>
        {/* Ticket list containers */}
        <Box width={"456px"} marginRight={"35px"}>
          <Box
            width={"100%"}
            bgcolor={cardBgColor}
            display={"flex"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            padding={"15px"}
            sx={{
              borderTopRightRadius: "15px",
              borderTopLeftRadius: "15px",
            }}
          >
            <Image src={"/logos/docs.png"} width={20} height={24} alt='docs icon' quality={100} />
            <Typography marginLeft={"20px"}>Open Tickets</Typography>
          </Box>
          <Box
            sx={{
              // the ticket box container height is dynamically calculated hard set based on PX value, this is to make the box scrollable
              height: "calc(100vh - 490px)",
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
            {/* all ticket boxes */}
            {sourceOpenTickets.map((ticket: TicketSchemaWithoutMessages, index: number) => {
              return <TicketItem key={index} ticket={ticket} getTicketApiHandler={getTicketApiHandler} />;
            })}
          </Box>
        </Box>
        {/* ---------------------------------------------------------------------------------------------------------------- */}
        {/* Ticket response containers */}
        <Box width={"456px"}>
          <Box
            display={"flex"}
            sx={{
              border: 2,
              borderColor: borderColor,
              borderTopRightRadius: "15px",
              borderTopLeftRadius: "15px",
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
              border: 2,
              borderTop: 0,
              borderColor: borderColor,
              borderBottomRightRadius: "15px",
              borderBottomLeftRadius: "15px",
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
