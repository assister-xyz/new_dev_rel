import { DOMAIN } from "@/constants/domains";
import { TicketResponseMessagesSchema } from "@/types/apiResponseSchema";

export async function getDashBoardStatsCardDataApi(period: string, clientName: string): Promise<Response> {
  const response: Response = await fetch(`${DOMAIN}/api/dashboard/stats/?period=${period}&client-name=${clientName}`, {
    method: "GET",
  });
  return response;
}

export async function getDashBoardFAQInsightApi(clientName: string): Promise<Response> {
  const response: Response = await fetch(`${DOMAIN}/api/dashboard/insights/faq/?client-name=${clientName}`, {
    method: "GET",
  });
  return response;
}
