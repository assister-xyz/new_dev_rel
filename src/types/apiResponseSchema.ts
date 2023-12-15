export interface TicketSchema {
  username: string;
  avatar: string;
  request: string;
  client: string;
  source: string;
  status: string;
  messages: TicketMessagesSchema[];
  id: string;
  createdDate: string;
  createdDatetime: string;
}

export interface TicketSchemaWithoutMessages {
  username: string;
  avatar: string;
  request: string;
  client: string;
  source: string;
  status: string;
  id: string;
  createdDate: string;
  createdDatetime: string;
}

export interface TicketMessagesSchema {
  senderType: string;
  message: string;
  ticketId: string;
  id: string;
  createdDate: string;
  createdDatetime?: string;
}

export interface TicketResponseMessagesSchema {
  senderType: string;
  message: string;
  ticketId: string;
}

export interface DashBoardDataSchema {
  current_period_unique_user_count: string;
  current_period_total_queries_count: string;
  current_period_total_open_ticket_count: string;
  current_period_ticket_response_time: string;
  queries_percent_change: string;
  open_tickets_percent_change: string;
  unique_user_percent_change: string;
  ticket_response_time_percent_change: string;
  ai_success_rate: string;
  ai_time_saved: string;
}
