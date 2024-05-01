import {Task} from "../component/GanttChart.tsx";

export function createSingleTaskLaneExample(): Task[] {
    return [
        {rowId: "id_0", start: new Date("2024-04-01T00:00:00"), end: new Date("2024-04-03T00:00:00")},
        {rowId: "id_0", start: new Date("2024-04-07T00:00:00"), end: new Date("2024-04-08T00:00:00")},
        {rowId: "id_1", start: new Date("2024-04-03T00:00:00"), end: new Date("2024-04-05T00:00:00")},
        {rowId: "id_2", start: new Date("2024-04-11T00:00:00"), end: new Date("2024-04-15T00:00:00")},
        {rowId: "id_3", start: new Date("2024-04-30T08:00:00"), end: new Date("2024-04-30T15:00:00")},
        {rowId: "id_4", start: new Date("2024-04-29T11:00:00"), end: new Date("2024-04-29T15:00:00")},
    ]

}

export function createVanillaTasks(): Task[] {
    return [
        createTask("id1_long_id_test", new Date("2024-04-29T00:00:00"), new Date("2024-04-29T23:59:00")),
        createTask("id2", new Date("2024-04-29T00:00:00"), new Date("2024-04-29T23:59:00")),
        createTask("id3", new Date("2024-04-30T08:00:00"), new Date("2024-04-30T23:00:00")),
        createTask("id4", new Date("2024-05-01T03:00:00"), new Date("2024-05-01T23:00:00")),
        createTask("id5", new Date("2024-04-01T00:00:00"), new Date("2024-04-03T23:59:00")),
        createTask("id6", new Date("2024-04-05T03:00:00"), new Date("2024-04-05T23:00:00")),
        createTask("id7", new Date("2024-03-10T00:00:00"), new Date("2024-03-10T23:59:00")),
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
            start: start2,
            end,
        })


    }
    return tasks
}


function createTask(id: string, start: Date, end: Date): Task {
    return {rowId: id, start, end}
}
