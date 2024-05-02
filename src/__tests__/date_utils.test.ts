import {dateOverlaps} from "../date_utils.ts";

test('Same date overlaps', () => {
    expect(dateOverlaps(new Date(),new Date(),new Date(),new Date())).toBeTruthy();
});

test('Different date does not overlap', () => {
    const taskStart = new Date();
    taskStart.setDate(taskStart.getDate()-2)
    const taskEnd = new Date();
    taskEnd.setDate(taskEnd.getDate()-1)
    expect(dateOverlaps(taskStart,taskEnd,new Date(),new Date())).toBeFalsy();
});
