import { DOMAIN } from "@/constants/domains";
import { TicketResponseMessagesSchema } from "@/types/apiResponseSchema";

export async function getDashBoardDataApi(source: string, client: string): Promise<Response> {
  const response: Response = await fetch(`${DOMAIN}/api/dashboard/?source=${source}&client=${client}`, {
    method: "GET",
  });
  return response;
}

export async function getTicketApi(ticketId: string): Promise<Response> {
  const response: Response = await fetch(`${DOMAIN}/api/ticket/${ticketId}`, {
    method: "GET",
  });
  return response;
}

export async function addTicketResponseMessageApi(ticketId: string, message: TicketResponseMessagesSchema): Promise<Response> {
  const response: Response = await fetch(`${DOMAIN}/api/ticket/${ticketId}/messages`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
  return response;
}
