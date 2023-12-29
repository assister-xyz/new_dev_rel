"use client";

import { Box, Typography } from "@mui/material";
import React, { ReactElement, useEffect, useState } from "react";
import StatsCard from "@/components/StatsCard";
import { getDashBoardFAQInsightApi, getDashBoardStatsCardDataApi } from "@/apis/dashboardPage";
import { DashBoardDataSchema } from "@/types/apiResponseSchema";
import { StatsCardStatesInterface } from "@/types/states";
import { navigationHandler } from "@/utils/nav";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function DashboardPage(): ReactElement {
  const router: AppRouterInstance = useRouter();

  const [period, setPeriod] = useState<string>("weekly");

  const [userStatsCardStates, setUserStatsCardStates] = useState<StatsCardStatesInterface>({ value: "--", percentChange: "--" });
  const [queryStatsCardStates, setQueryStatsCardStates] = useState<StatsCardStatesInterface>({ value: "--", percentChange: "--" });
  const [ticketStatsCardStates, setTicketStatsCardStates] = useState<StatsCardStatesInterface>({ value: "--", percentChange: "--" });
  const [ticketResponseTimeStatsCardStates, setTicketResponseTimeStatsCardStates] = useState<StatsCardStatesInterface>({ value: "--", percentChange: "--" });
  const [aiSuccessRateStatsCardStates, setAiSuccessRateStatsCardStates] = useState<StatsCardStatesInterface>({ value: "--", percentChange: "--" });
  const [timeSavedStatsCardStates, setTimeSavedStatsCardStates] = useState<StatsCardStatesInterface>({ value: "--", percentChange: "--" });

  const [faqInsight, setFaqInsight] = useState<string>("");
  const [faqInsightLoading, setFaqInsightLoading] = useState<boolean>(true);

  // ------------------------------------------------------------------------------------------------------------------------------------------------

  function periodToggleHandler(period: string): void {
    period && setPeriod(period);
  }

  // ------------------------------------------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    async function getDashBoardStatsCardDataApiHandler(period: string, clientName: string): Promise<void> {
      console.log("getDashBoardStatsCardDataApiHandler runs on Nav");
      try {
        const getResponse: Response = await getDashBoardStatsCardDataApi(period, clientName);
        if (getResponse.ok === false) {
          const responsePayload: { result: string } = await getResponse.json();
          throw new Error(responsePayload.result);
        }

        // when no error, we process response payload then parse --> update all states using the response payload

        const responsePayload: { result: DashBoardDataSchema } = await getResponse.json();
        console.log('responsePayload',responsePayload)


        setUserStatsCardStates({ value: responsePayload.result.current_period_unique_user_count, percentChange: responsePayload.result.unique_user_percent_change });
        setQueryStatsCardStates({ value: responsePayload.result.current_period_total_queries_count, percentChange: responsePayload.result.queries_percent_change });
        setTicketStatsCardStates({ value: responsePayload.result.current_period_total_open_ticket_count, percentChange: responsePayload.result.open_tickets_percent_change });
        setTicketResponseTimeStatsCardStates({
          value: responsePayload.result.current_period_ticket_response_time,
          percentChange: responsePayload.result.ticket_response_time_percent_change,
        });
        setAiSuccessRateStatsCardStates({ value: responsePayload.result.ai_success_rate, percentChange: "none" });
        setTimeSavedStatsCardStates({ value: responsePayload.result.ai_time_saved, percentChange: "none" });
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }

    const clientName: string | null = localStorage.getItem("client");
    if (clientName) {
      getDashBoardStatsCardDataApiHandler(period, clientName);
    }
  }, [period]);

  useEffect(() => {
    async function getDashBoardFAQInsightApiHandler(clientName: string): Promise<void> {
      console.log("getDashBoardFAQInsightApiHandler runs on Nav");

      try {
        setFaqInsightLoading(true);
        const getResponse: Response = await getDashBoardFAQInsightApi(clientName);

        if (getResponse.ok === false) {
          const responsePayload: { result: string } = await getResponse.json();
          throw new Error(responsePayload.result);
        }

        const responsePayload: { result: string } = await getResponse.json();
        setFaqInsight(responsePayload.result);
        setFaqInsightLoading(false);
      } catch (error: unknown) {
        setFaqInsightLoading(false);
        if (error instanceof Error) {
          alert(error.message);
        }
      }
    }

    const clientName: string | null = localStorage.getItem("client");
    if (clientName) {
      getDashBoardFAQInsightApiHandler(clientName);
    }
  }, []);

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <Box className='flex-1 space-y-4 p-8 pt-6'>
      <Box className='flex items-center justify-between space-y-2'>
        <Typography variant='h1'>Dashboard</Typography>

        {/* ------------------------------------------------------------------------------------------------------------------------------ */}
        {/* period selection */}
        <ToggleGroup type="single" value={period} onValueChange={periodToggleHandler}>
          <ToggleGroupItem value="weekly" aria-label="Toggle weekly">
            Weekly
          </ToggleGroupItem>
          <ToggleGroupItem value="monthly" aria-label="Toggle monthly">
            Monthly
          </ToggleGroupItem>
        </ToggleGroup>
      </Box>

      {/* ------------------------------------------------------------------------------------------------------------------------------ */}
      {/* top 4 stats card */}

      <Box className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard statsName={"Unique users"} statsIconPath={"/logos/users.svg"} value={userStatsCardStates.value} percentChange={userStatsCardStates.percentChange} />
        <StatsCard statsName={"Queries"} statsIconPath={"/logos/queries.svg"} value={queryStatsCardStates.value} percentChange={queryStatsCardStates.percentChange} />
        <StatsCard statsName={"Open tickets"} statsIconPath={"/logos/ticket.svg"} value={ticketStatsCardStates.value} percentChange={ticketStatsCardStates.percentChange} />
        <StatsCard
          statsName={"Tickets Response Time"}
          statsIconPath={"/logos/response_time.svg"}
          value={ticketResponseTimeStatsCardStates.value}
          percentChange={ticketResponseTimeStatsCardStates.percentChange}
        />
      </Box>

      {/* ------------------------------------------------------------------------------------------------------------------------------ */}
      {/* Bottom */}

      <Box className='grid gap-4 md:grid-cols-2 lg:grid-cols-6 grid-rows-3'>
        <Card className='col-span-3 row-span-full flex flex-col'>
          <CardHeader>
            <Typography variant='h4'>Insight</Typography>
            <Typography className='text-sm'>Proposals for Dev Portal improvements based on user queries.</Typography>
          </CardHeader>
          <Separator className='w-[90%] ml-5' />
          <CardContent className='py-5 flex-1'>
            <Box className='flex justify-center items-center h-full'>
              <Image src={"/logos/zap.svg"} width={32} height={32} className='mr-2' alt='zap icon' />
              <Typography variant='body1'>
                Launching soon. We are collecting data to generate insights for you.
              </Typography>
            </Box>
            {/*<Box className='flex justify-between items-start' height={"300px"} overflow={"auto"}>*/}
            {/*  <Image src={"/logos/zap.svg"} width={32} height={32} alt='zap icon' />*/}

            {/*  <Box className='pl-5 pr-[2rem]' width={"100%"}>*/}
            {/*    {faqInsightLoading ? (*/}
            {/*      <Box display={"flex"} justifyContent={"center"} alignItems={"center"} width={"100%"} height={"250px"}>*/}
            {/*        <SpinnerLoading width='90px' height='90px' border={8} />*/}
            {/*      </Box>*/}
            {/*    ) : (*/}
            {/*      <Typography*/}
            {/*        sx={{*/}
            {/*          whiteSpace: "pre-line",*/}
            {/*        }}*/}
            {/*      >*/}
            {/*        {faqInsight}*/}
            {/*      </Typography>*/}
            {/*    )}*/}
            {/*  </Box>*/}
            {/*</Box>*/}
          </CardContent>
        </Card>
        <Box className='col-span-3 row-span-1 grid gap-4 grid-cols-2'>
          <StatsCard
            statsName={"AI Success Rate"}
            statsIconPath={"/logos/ai.svg"}
            value={aiSuccessRateStatsCardStates.value}
            percentChange={aiSuccessRateStatsCardStates.percentChange}
          />
          <StatsCard
            statsName={"Time Saved"}
            statsIconPath={"/logos/time_saved.svg"}
            value={timeSavedStatsCardStates.value}
            percentChange={timeSavedStatsCardStates.percentChange}
          />
        </Box>
        <Box className='col-span-3 row-span-2 flex flex-col items-center justify-center'>
          <Button
            variant='outline'
            className='w-[300px]'
            onClick={() => {
              navigationHandler("/console/knowledge-base", router);
            }}
          >
            Update Knowledge Base
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
