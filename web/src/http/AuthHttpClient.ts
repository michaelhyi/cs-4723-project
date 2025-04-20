export default class AuthHttpClient {
    static async login(email: string, password: string) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            },
        );

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error);
        }
    }

    static async register(
        name: string,
        email: string,
        password: string,
        confirmPassword: string,
    ) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    confirmPassword,
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

    static async getMe() {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`,
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

    static async logout() {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        });
    }
}
