import {Item} from "../GanttChart.tsx";

export function createSingleItemLaneExample(): Item[] {
    return [
        createItem("id_1", "id_0", new Date("2024-04-01T00:00:00"), new Date("2024-04-03T00:00:00")),
        createItem("id_2", "id_0", new Date("2024-04-07T00:00:00"), new Date("2024-04-08T00:00:00")),
        createItem("id_3", "id_1", new Date("2024-04-03T00:00:00"), new Date("2024-04-05T00:00:00")),
        createItem("id_4", "id_2", new Date("2024-04-11T00:00:00"), new Date("2024-04-15T00:00:00")),
        createItem("id_5", "id_3", new Date("2024-04-30T08:00:00"), new Date("2024-04-30T15:00:00")),
        createItem("id_6", "id_4", new Date("2024-04-29T11:00:00"), new Date("2024-04-29T15:00:00")),
    ]

}

export function createVanillaItems(): Item[] {
    return [
        createItem2("id1", "id1", "Item 1", new Date("2024-04-20T00:00:00"), new Date("2024-04-27T23:59:00")),
        createItem2("id2", "id1", "Item 2 long name", new Date("2024-04-15T18:00:00"), new Date("2024-04-18T23:59:00")),
        createItem2("id3", "id3", "Item 3", new Date("2024-04-30T08:00:00"), new Date("2024-04-30T23:00:00")),
        createItem2("id4", "id4", "Item 4", new Date("2024-04-20T03:00:00"), new Date("2024-05-10T23:00:00")),
        createItem2("id5", "id5", "Item 5", new Date("2024-04-01T08:30:00"), new Date("2024-04-01T12:59:00")),
        createItem2("id6", "id6", "Item 6", new Date("2024-04-05T03:00:00"), new Date("2024-04-05T23:00:00")),
        createItem2("id7", "id7", "Item 7", new Date("2024-03-10T00:00:00"), new Date("2024-03-10T23:59:00")),
    ]
}

export function createItemSequence(numberOfItems: number): Item[] {
    const items: Item[] = []
    const start = new Date("2024-01-01T00:00:00")
    for (let i = 0; i < numberOfItems; i++) {
        const start2 = new Date(start)
        start2.setDate(start2.getDate() + i)
        const end = new Date(start2)
        end.setHours(23)
        end.setMinutes(59)

        items.push({
            id: "id_" + i,
            rowId: "rowId_" + i,
            displayName: "Item " + i,
            start: start2,
            end,
        })


    }
    return items
}


function createItem(id: string, rowId: string, start: Date, end: Date): Item {
    return {id: id, rowId: rowId, displayName: rowId, start, end}
}

function createItem2(id: string, rowId: string, displayName: string, start: Date, end: Date): Item {
    return {id: id, rowId: rowId, displayName, start, end}
}
