"use client";

import { Box } from "@mui/material";
import React, { ReactElement, use, useEffect, useRef, useState } from "react";
import StatsCard from "@/components/StatsCard";
import { addTicketResponseMessageApi, getDashBoardDataApi, getTicketApi } from "@/apis/dashboardPage";
import { DashBoardDataSchema, TicketMessagesSchema, TicketResponseMessagesSchema, TicketSchema, TicketSchemaWithoutMessages } from "@/types/apiResponseSchema";
import { SourceBotCardStatesInterface, StatsCardStatesInterface } from "@/types/states";
import { loginCheckHandler } from "@/utils/auth";
import { navigationHandler } from "@/utils/nav";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";

export default function DashboardPage(): ReactElement {
  const router: AppRouterInstance = useRouter();

  // use useRef to create a reference to the messages container, then use this reference to scroll to the bottom of the container
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // set initial state of client
  const [selectedSource, setSelectedSource] = useState<string>("discord");
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
    <Box className="flex-1 space-y-4 p-8 pt-6">
      <Box className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Box className="flex items-center space-x-2">
          <ToggleGroup type="single">
            <ToggleGroupItem value="Weekly">Weekly</ToggleGroupItem>
            <ToggleGroupItem value="Monthly">Monthly</ToggleGroupItem>
          </ToggleGroup>
        </Box>
      </Box>
      <Box className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard statsName={"Unique users"} statsIcon={"/logos/users.png"} value={weeklyUserStatsCardStates.value} percentChange={weeklyUserStatsCardStates.percentChange} />
        <StatsCard statsName={"Queries"} statsIcon={"/logos/queries.png"} value={queryStatsCardStates.value} percentChange={queryStatsCardStates.percentChange} />
        <StatsCard statsName={"Open tickets"} statsIcon={"/logos/tickets.png"} value={ticketStatsCardStates.value} percentChange={ticketStatsCardStates.percentChange} />
        <StatsCard statsName={"Ticket’s Response Time"} statsIcon={"/logos/users.png"} value={dailyUserStatsCardStates.value} percentChange={dailyUserStatsCardStates.percentChange} />
      </Box>
      <Box className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 grid-rows-3">
        <Card className="col-span-3 row-span-full">
          <CardHeader>
            <CardTitle className='text-lg font-medium'>Insight</CardTitle>
            <CardDescription className='text-sm'>Proposals for Dev Portal improvements based on user queries.</CardDescription>
          </CardHeader>
          <Separator className="w-[90%] m-auto"/>
          <CardContent className="py-5">
            <Box className='flex justify-between items-start'>
              {/*<Image src={zapImage} width={32} height={32} alt='zap icon' />*/}
              <Box className='pl-4 pr-[2rem]'>
                <p className='text-foreground text-sm'>
                  Add more information about <b>signatureSubscribe</b>. Users often ask for a description of how this feature works.
                </p>
                <br/>
                <p>
                  This may be due to a lack of clarity in the description of how the function works or its location in an inconvenient place.
                </p>
                <br/>
                <p>Please add this information to the knowledge base and update it.</p>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Box className="col-span-3 row-span-1 grid gap-4 grid-cols-2">
          <StatsCard statsName={"AI Success Rate"} statsIcon={"/logos/users.png"} value='98.3%' />
          <StatsCard statsName={"Time Saved"} statsIcon={"/logos/users.png"} value='260H' />
        </Box>
        <Box className="col-span-3 row-span-2 flex flex-col items-center justify-center">
          <Button variant='outline' className='w-[300px]'>Update Knowledge Base</Button>
        </Box>
      </Box>
    </Box>
  );
}
