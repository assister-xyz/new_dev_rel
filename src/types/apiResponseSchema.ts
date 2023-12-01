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
}

export interface TicketResponseMessagesSchema {
  senderType: string;
  message: string;
  ticketId: string;
}

export interface DashBoardDataSchema {
  source_open_tickets: TicketSchemaWithoutMessages[];
  source_total_tickets_count: string;
  source_total_queries_count: string;
  source_weekly_unique_user_count: string;
  source_daily_unique_user_count: string;
  source_daily_tickets_percentage_change: string;
  source_daily_queries_percentage_change: string;
  source_weekly_unique_user_percentage_change: string;
  source_daily_unique_user_percentage_change: string;
  discord_open_tickets_count: string;
  discord_most_recent_query_datetime: string;
  telegram_most_recent_query_datetime: string;
  telegram_open_tickets_count: string;
}
