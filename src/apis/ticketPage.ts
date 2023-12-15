import { DOMAIN } from "@/constants/domains";
import { TicketResponseMessagesSchema } from "@/types/apiResponseSchema";

export async function getOpenTicketsByPageApi(source: string, clientName: string, page: number): Promise<Response> {
  const response: Response = await fetch(`${DOMAIN}/api/tickets/?source=${source}&client-name=${clientName}&page=${page}`, {
    method: "GET",
  });
  return response;
}

// only for dev rel admin
export async function addTicketResponseMessageApi(ticketId: string, adminResponse: TicketResponseMessagesSchema): Promise<Response> {
  const response: Response = await fetch(`${DOMAIN}/api/ticket/${ticketId}/messages`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(adminResponse),
  });
  return response;
}

export async function getTicketApi(ticketId: string): Promise<Response> {
  const response: Response = await fetch(`${DOMAIN}/api/ticket/${ticketId}`, {
    method: "GET",
  });
  return response;
}

export async function updateTicketStatusApi(ticketId: string, status: string): Promise<Response> {
  const response: Response = await fetch(`${DOMAIN}/api/ticket/${ticketId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ticketStatus: status }),
  });
  return response;
}
