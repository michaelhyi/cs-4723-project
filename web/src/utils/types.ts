export interface Proxy {
    proxyId: number;
    userId: number;
    name: string;
    status: string;
    cloudProvider: string;
    cloudRegion: string;
    pricingPlan: string;
    apiProtocol: string;
    apiBaseUrl: string;
    proxyUrl: string;
    ipAddress: string;
    serverId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProxyLog {
    proxyLogId: number;
    proxyId: number;
    timestamp: string;
    method: string;
    path: string;
    statusCode: number;
    requestHeaders: string;
    responseHeaders: string;
    requestBody: string;
    responseBody: string;
}

export type ProxyWithLogs = Proxy & { logs: ProxyLog[] };
