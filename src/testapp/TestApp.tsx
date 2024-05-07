import {GanttChart, Task} from "../GanttChart.tsx";
import {createVanillaTasks} from "./example_data.ts";
import {useLocalStorage} from "@uidotdev/usehooks";
import {useState} from "react";
import {Controls, initEndDate, initStartDate} from "./Controls.tsx";
import {DateRange} from "../";
import "./style.css"
import TaskEdit from "./TaskEdit.tsx";

export function TestApp() {
    const [dateRange, setDateRange] = useLocalStorage<DateRange>("0", DateRange.WEEK)
    const [tasks, setTasks] = useState<Task[]>(createVanillaTasks())
    const [startDate, setStartDate] = useLocalStorage<Date>("start", initStartDate(new Date(), dateRange))
    const [endDate, setEndDate] = useLocalStorage<Date>("end", initEndDate(new Date(), dateRange))

    const [selectedTask, setSelectedTask] = useState<Task | undefined>()
    return (
        <><h4>react-minimalistic-gantt demo</h4>
            <Controls
                dateRange={dateRange}
                setDateRange={setDateRange}
                startDate={new Date(startDate)}
                setStartDate={setStartDate}
                endDate={new Date(endDate)}
                setEndDate={setEndDate}
            />
            <hr/>
            <GanttChart
                dateRange={dateRange}
                tasks={tasks}
                startDate={new Date(startDate)}
                endDate={new Date(endDate)}
                options={{showItemNames: true}}
                onItemClick={(t: Task) => setSelectedTask(t)}
            />
            {selectedTask && <TaskEdit task={selectedTask} tasks={tasks} setTasks={setTasks}/>}
        </>
    )
}
