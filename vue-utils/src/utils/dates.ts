// Authors: James Waters
import { format as format_ } from "date-fns";
import enGB from "date-fns/locale/en-GB";

export function format(date: Date, formatStr = "PP"): string {
    return format_(date, formatStr, {
        locale: enGB,
    });
}

export function formatDateTime(date: Date | string) {
    return format(parseDate(date), "yyyy-MM-dd HH:mm");
}

export function formatDateTimeS(date: Date | string) {
    return format(parseDate(date), "yyyy-MM-dd HH:mm:ss");
}

export function formatDate(date: Date | string) {
    return format(parseDate(date), "yyyy-MM-dd");
}

function parseDate(date: Date | string) {
    if (typeof date == "string") {
        return new Date(date);
    }
    return date;
}
