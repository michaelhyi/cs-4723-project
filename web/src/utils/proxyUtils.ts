export function mapStatus(status: string): string {
    if (status === "Running") {
        return "🟢 Running";
    }

    if (status === "Paused") {
        return "🟡 Paused";
    }

    return "🔴 Terminated";
}

export function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
}

export function formatJson(raw: string | null) {
    try {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        return JSON.stringify(parsed, null, 2);
    } catch {
        return raw ?? "N/A";
    }
}
