import {dateOverlaps} from "../component/date_utils.ts";

test('Same date overlaps', () => {
    expect(dateOverlaps(new Date(),new Date(),new Date(),new Date())).toBeTruthy();
});

test('Different date does not overlap', () => {
    let taskStart = new Date();
    taskStart.setDate(taskStart.getDate()-2)
    let taskEnd = new Date();
    taskEnd.setDate(taskEnd.getDate()-1)
    expect(dateOverlaps(taskStart,taskEnd,new Date(),new Date())).toBeFalsy();
});
