import {GanttChart, Item} from "../GanttChart.tsx";
import {createVanillaItems} from "./example_data.ts";
import {useLocalStorage} from "@uidotdev/usehooks";
import {useState} from "react";
import {Controls, initEndDate, initStartDate} from "./Controls.tsx";
import {Resolution} from "../";
import "./style.css"
import ItemEdit from "./ItemEdit.tsx";

export function TestApp() {
    const [resolution, setResolution] = useLocalStorage<Resolution>("0", Resolution.WEEK)
    const [items, setItems] = useState<Item[]>(createVanillaItems())
    const [startDate, setStartDate] = useLocalStorage<Date>("start", initStartDate(new Date(), resolution))
    const [endDate, setEndDate] = useLocalStorage<Date>("end", initEndDate(new Date(), resolution))

    const [selectedItem, setSelectedItem] = useState<Item | undefined>()
    return (
        <><h4>react-minimalistic-gantt demo</h4>
            <Controls
                resolution={resolution}
                setResolution={setResolution}
                startDate={new Date(startDate)}
                setStartDate={setStartDate}
                endDate={new Date(endDate)}
                setEndDate={setEndDate}
            />
            <hr/>
            <GanttChart
                resolution={resolution}
                items={items}
                startDate={new Date(startDate)}
                endDate={new Date(endDate)}
                options={{showItemNames: true}}
                onItemClick={(t: Item) => setSelectedItem(t)}
            />
            {selectedItem && <ItemEdit item={selectedItem} items={items} setItems={setItems}/>}
        </>
    )
}
