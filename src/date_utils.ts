export type HourFormat = "12" | "24"

export function getStartOfWeek(date: Date) {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
}

export function getEndOfWeek(date: Date) {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
}

export function formatDate(date: Date) {
    return date.toLocaleString('no-NB').replace(/,/g, '');
}

export function formatDateToYYYYMMDD(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 to month since it's zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function getNumberOfDays(startDate: Date, endDate: Date) {
    // Convert both dates to UTC timestamps
    const startUTC = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endUTC = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    // Calculate the difference in milliseconds
    const diffInMs = endUTC - startUTC;

    // Convert the difference to days
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}

export function getNumberOfDaysInMonth(year: number, month: number) {
    // Create a Date object for the first day of the next month
    const nextMonthFirstDay = new Date(year, month + 1, 1);

    // Subtract one day to get the last day of the current month
    nextMonthFirstDay.setDate(nextMonthFirstDay.getDate() - 1);

    // Get the day of the month from the last day of the current month
    return nextMonthFirstDay.getDate();
}

export function getISOWeekNumber(date: Date) {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNumber = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    // Return week number
    return weekNumber;
}


export function dateOverlaps(taskStart: Date, taskEnd: Date, searchStart: Date, searchEnd: Date) {
    return (taskStart <= searchEnd && taskEnd >= searchStart) ||
        (searchStart <= taskEnd && searchEnd >= taskStart);
}

export function getHours(dt: Date, hourFormat: HourFormat | undefined): string {
    const hours = dt.getHours();
    const hours12 = hours % 12 || 12;
    const amPm = hours < 12 ? 'AM' : 'PM';

    if (hourFormat == "12") {
        return `${hours12} ${amPm}`;
    }
    const formattedHours = ('0' + hours).slice(-2);
    return `${formattedHours}`;

}
