export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
export type ApiStatus = "active" | "inactive";

export interface ApiTarget {
  id: number;
  name: string;
  url: string;
  method: HttpMethod;
  interval: number;
  status: ApiStatus;
  avgResponseTime: number;
  uptime: number;
}

export interface ApiLog {
  id: number;
  apiName: string;
  statusCode: number;
  responseTime: number;
  responseSize: string;
  createdAt: string;
}

export interface ResponseTimePoint {
  time: string;
  [key: string]: string | number;
}

export interface StatusDistItem {
  name: string;
  value: number;
  color: string;
}

export interface DashboardSummary {
  avgResponseTime: number;
  totalRequests: number;
  errorRate: string;
  uptime: number;
}
