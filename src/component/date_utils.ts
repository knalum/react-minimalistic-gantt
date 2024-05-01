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

export function getNumberOfDaysInMonth(year:number, month:number) {
    // Create a Date object for the first day of the next month
    const nextMonthFirstDay = new Date(year, month + 1, 1);

    // Subtract one day to get the last day of the current month
    nextMonthFirstDay.setDate(nextMonthFirstDay.getDate() - 1);

    // Get the day of the month from the last day of the current month
    return nextMonthFirstDay.getDate();
}

export function getISOWeekNumber(date:Date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const daysOffset = (firstDayOfYear.getDay() - 1 + 7) % 7;
    const firstThursday = new Date(firstDayOfYear.getTime() + (4 - daysOffset) * 86400000); // 86400000 ms in a day
    const daysDiff = Math.round((date.getTime() - firstThursday.getTime()) / 86400000);
    const weekNumber = 1 + Math.floor(daysDiff / 7);

    return weekNumber;
}


export function dateOverlaps(taskStart:Date,taskEnd:Date,searchStart:Date,searchEnd:Date){
    return (taskStart <= searchEnd && taskEnd >= searchStart) ||
        (searchStart <= taskEnd && searchEnd >= taskStart);
}
