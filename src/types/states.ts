export interface StatsCardStatesInterface {
  value: string;
  percentChange: string;
}

export interface SourceBotCardStatesInterface {
  lastQueryDatetime: string;
  isOnline: boolean;
  openTicketsCount: string;
}

export interface EmbeddedFileStatesInterface {
  client: string;
  fileName: string;
  id: string;
  createdDate: string;
}
