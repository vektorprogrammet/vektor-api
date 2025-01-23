import { date } from "drizzle-orm/mysql-core";
import { parseError } from "./types";

export function dateToISOString(date: Date) {
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

export function ISOStringtoDate(string: string) {
    const dateInt = Date.parse(string);
    if (Number.isNaN(dateInt)) {
        return {
            success: false,
            error: parseError("Failed to parse ISO-string.", string),
        }
    }
    return new Date(dateInt);
}

