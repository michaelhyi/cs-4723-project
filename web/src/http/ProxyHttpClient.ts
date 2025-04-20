export default class ProxyHttpClient {
    static async getAllProxiesByUserId(userId: string) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/proxies/${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include",
            },
        );

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error);
        }
    }

    static async getProxyWithLogsByProxyId(proxyId: string) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/proxies/${proxyId}/with-logs`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include",
            },
        );

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error);
        }
    }

    static async createProxy({
        name,
        cloudProvider,
        cloudProviderRegion,
        pricingPlan,
        apiProtocol,
        baseApiUrl,
    }: {
        name: string;
        cloudProvider: string;
        cloudProviderRegion: string;
        pricingPlan: string;
        apiProtocol: string;
        baseApiUrl: string;
    }) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/proxies`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name,
                    cloudProvider,
                    cloudProviderRegion,
                    pricingPlan,
                    apiProtocol,
                    baseApiUrl,
                }),
            },
        );

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error);
        }
    }
}
