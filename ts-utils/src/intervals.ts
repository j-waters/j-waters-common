import {
    addDays,
    addMonths,
    addWeeks,
    addYears,
    differenceInDays,
    endOfDay,
    endOfMonth,
    endOfWeek,
    endOfYear,
    startOfDay,
    startOfMonth,
    startOfWeek,
    startOfYear,
} from "date-fns";

export enum IntervalSize {
    DAY = "DAY",
    WEEK = "WEEK",
    MONTH = "MONTH",
    YEAR = "YEAR",
    FOREVER = "FOREVER",
}
export function getInterval(start?: Date, end?: Date): IntervalSize {
    if (!start) return IntervalSize.FOREVER;
    end = end ?? new Date();

    const diff = differenceInDays(end, start);
    if (diff < 6) {
        return IntervalSize.DAY;
    } else if (diff < 20) {
        return IntervalSize.WEEK;
    } else if (diff < 50) {
        return IntervalSize.MONTH;
    } else if (diff < 365 * 2) {
        return IntervalSize.YEAR;
    }
    return IntervalSize.FOREVER;
}

export function lowerInterval(interval: IntervalSize) {
    switch (interval) {
        case IntervalSize.DAY:
            return IntervalSize.DAY;
        case IntervalSize.WEEK:
            return IntervalSize.DAY;
        case IntervalSize.MONTH:
            return IntervalSize.WEEK;
        case IntervalSize.YEAR:
            return IntervalSize.MONTH;
        case IntervalSize.FOREVER:
            return IntervalSize.YEAR;
    }
}

export function snapToEndOfPeriod(date: Date, interval: IntervalSize) {
    switch (interval) {
        case IntervalSize.DAY:
            return endOfDay(date);
        case IntervalSize.WEEK:
            return endOfWeek(date);
        case IntervalSize.MONTH:
            return endOfMonth(date);
        case IntervalSize.YEAR:
            return endOfYear(date);
        case IntervalSize.FOREVER:
            return new Date(9999, 1, 1);
    }
}

export function snapToStartOfPeriod(date: Date, interval: IntervalSize) {
    switch (interval) {
        case IntervalSize.DAY:
            return startOfDay(date);
        case IntervalSize.WEEK:
            return startOfWeek(date);
        case IntervalSize.MONTH:
            return startOfMonth(date);
        case IntervalSize.YEAR:
            return startOfYear(date);
        case IntervalSize.FOREVER:
            return new Date(0, 1, 1);
    }
}

export function subdivisionsBetween(
    start: Date,
    end: Date,
    interval: IntervalSize
) {
    const out: { start: Date; end: Date }[] = [];
    let cur = start;
    while (cur < end) {
        const curEnd = intervalAdditionFunc(interval)(cur, 1);
        out.push({ start: cur, end: curEnd });
        cur = addDays(curEnd, 1);
    }
    return out;
}

export function intervalAdditionFunc(interval: IntervalSize) {
    switch (interval) {
        case IntervalSize.DAY:
            return addDays;
        case IntervalSize.WEEK:
            return addWeeks;
        case IntervalSize.MONTH:
            return addMonths;
        case IntervalSize.YEAR:
            return addYears;
        case IntervalSize.FOREVER:
            return addYears;
    }
}
