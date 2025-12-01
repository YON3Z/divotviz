export enum ChatSender {
  USER = 'user',
  AI = 'ai'
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: ChatSender;
  timestamp: number;
}

export interface ChartDataPoint {
  name: string | number;
  value: number;
  fill?: string;
}

export interface LeakageDataPoint {
  leakage: number;
  clusters: number;
  color: string;
}