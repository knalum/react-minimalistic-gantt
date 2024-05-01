import {GanttChart, Task} from "../component/GanttChart.tsx";
import {createVanillaTasks} from "./example_data.ts";
import {useLocalStorage} from "@uidotdev/usehooks";
import {useState} from "react";
import {Controls, initEndDate, initStartDate} from "./Controls.tsx";
import {DateRange} from "../component";

export function TestApp() {
    const [resolution, setResolution] = useLocalStorage<DateRange>("0", DateRange.WEEK)
    const [tasks] = useState<Task[]>(createVanillaTasks())
    const [startDate, setStartDate] = useLocalStorage<Date>("start",initStartDate(new Date(), resolution))
    const [endDate, setEndDate] = useLocalStorage<Date>("end",initEndDate(new Date(), resolution))

    return (
        <>
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
                tasks={tasks}
                startDate={new Date(startDate)}
                endDate={new Date(endDate)}
            />
        </>
    )
}
