import {Task} from "../GanttChart.tsx";

export function createSingleTaskLaneExample(): Task[] {
    return [
        createTask("id_0", new Date("2024-04-01T00:00:00"), new Date("2024-04-03T00:00:00")),
        createTask("id_0", new Date("2024-04-07T00:00:00"), new Date("2024-04-08T00:00:00")),
        createTask("id_1", new Date("2024-04-03T00:00:00"), new Date("2024-04-05T00:00:00")),
        createTask("id_2", new Date("2024-04-11T00:00:00"), new Date("2024-04-15T00:00:00")),
        createTask("id_3", new Date("2024-04-30T08:00:00"), new Date("2024-04-30T15:00:00")),
        createTask("id_4", new Date("2024-04-29T11:00:00"), new Date("2024-04-29T15:00:00")),
    ]

}

export function createVanillaTasks(): Task[] {
    return [
        createTask2("id1", "Item 1", new Date("2024-04-20T00:00:00"), new Date("2024-04-27T23:59:00")),
        createTask2("id1", "Item 2 long name", new Date("2024-04-15T00:00:00"), new Date("2024-04-18T23:59:00")),
        createTask2("id3", "Item 3", new Date("2024-04-30T08:00:00"), new Date("2024-04-30T23:00:00")),
        createTask2("id4", "Item 4", new Date("2024-05-01T03:00:00"), new Date("2024-05-01T23:00:00")),
        createTask2("id5", "Item 5", new Date("2024-04-01T00:00:00"), new Date("2024-04-03T23:59:00")),
        createTask2("id6", "Item 6", new Date("2024-04-05T03:00:00"), new Date("2024-04-05T23:00:00")),
        createTask2("id7", "Item 7", new Date("2024-03-10T00:00:00"), new Date("2024-03-10T23:59:00")),
    ]
}

export function createTaskSequence(numberOfTasks: number): Task[] {
    const tasks: Task[] = []
    const start = new Date("2024-01-01T00:00:00")
    for (let i = 0; i < numberOfTasks; i++) {
        const start2 = new Date(start)
        start2.setDate(start2.getDate() + i)
        const end = new Date(start2)
        end.setHours(23)
        end.setMinutes(59)

        tasks.push({
            rowId: "id_" + i,
            displayName: "Item " + i,
            start: start2,
            end,
        })


    }
    return tasks
}


function createTask(rowId: string, start: Date, end: Date): Task {
    return {rowId: rowId, displayName: rowId, start, end}
}

function createTask2(rowId: string, displayName: string, start: Date, end: Date): Task {
    return {rowId: rowId, displayName, start, end}
}
