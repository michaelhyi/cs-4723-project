export default class AuthHttpClient {
    static async login(email, password) {
        const response = await fetch('http://localhost:8080/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error);
        }
    }

    static async register(email, password, confirmPassword) {
        const response = await fetch('http://localhost:8080/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ email, password, confirmPassword })
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error);
        }
    }

    static async getMe() {
        const response = await fetch('http://localhost:8080/api/v1/auth/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw new Error(data.error);
        }

    }

    static async logout() {
        await fetch('http://localhost:8080/api/v1/auth/logout', {
            method: 'POST',
            headers: {
                "Accept": "application/json"
            },
            credentials: 'include'
        });
    }
}