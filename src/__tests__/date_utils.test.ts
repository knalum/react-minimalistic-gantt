import {dateOverlaps, getISOWeekNumber} from "../date_utils.ts";

test('Same date overlaps', () => {
    expect(dateOverlaps(new Date(), new Date(), new Date(), new Date())).toBeTruthy();
});

test('Different date does not overlap', () => {
    const taskStart = new Date();
    taskStart.setDate(taskStart.getDate() - 2)
    const taskEnd = new Date();
    taskEnd.setDate(taskEnd.getDate() - 1)
    expect(dateOverlaps(taskStart, taskEnd, new Date(), new Date())).toBeFalsy();
});

test("Get week no", () => {
    expect(getISOWeekNumber(new Date("2024-04-01T08:00:00"))).toEqual(14)
    expect(getISOWeekNumber(new Date("2024-04-02T08:00:00"))).toEqual(14)
    expect(getISOWeekNumber(new Date("2024-04-03T08:00:00"))).toEqual(14)
    expect(getISOWeekNumber(new Date("2024-04-04T08:00:00"))).toEqual(14)
    expect(getISOWeekNumber(new Date("2024-04-05T08:00:00"))).toEqual(14)
    expect(getISOWeekNumber(new Date("2024-04-06T08:00:00"))).toEqual(14)
    expect(getISOWeekNumber(new Date("2024-04-07T08:00:00"))).toEqual(14)

    expect(getISOWeekNumber(new Date("2024-04-08T08:00:00"))).toEqual(15)
    expect(getISOWeekNumber(new Date("2024-04-14T08:00:00"))).toEqual(15)
})
