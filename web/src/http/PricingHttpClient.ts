export default class PricingHttpClient {
    static async subscribeToEnterprisePlan(userId: string) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pricing/${userId}/subscribe/enterprise`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            },
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        return data;
    }
}
