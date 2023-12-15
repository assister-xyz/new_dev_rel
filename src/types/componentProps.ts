import exp from "constants";
import { EmbeddedFileStatesInterface } from "./states";

export interface StatsCardPropsInterface {
  statsIcon: string;
  statsName: string;
  value: string;
  percentChange?: string;
}

export interface SourceBotCardPropsInterface {
  sourceIcon: string;
  sourceName: string;
  lastQueryDatetime: string;
  isOnline: boolean;
  selectedSource: string;
  openTicketsCount: string;
  selectSourceHandler: (targetSource: string) => void;
}

export interface FileCardPropsInterface extends EmbeddedFileStatesInterface {
  deleteTargetFileHandler: (client: string, fileName: string) => Promise<void>;
}
