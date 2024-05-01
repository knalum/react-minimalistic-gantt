# react-minimalistic-gantt

A minimalistic gantt component for react

### Installation
The package can be installed via npm:

```npm i react-minimalistic-gantt```

```ts
import {DateRange, GanttChart, Task} from "react-minimalistic-gantt"

function App() {
    const tasks: Task[] = [
        {rowId: "row_id1", start: new Date("2024-01-01T08:00:00"), end: new Date("2024-01-02T16:00:00")},
        {rowId: "row_id1", start: new Date("2024-01-03T11:00:00"), end: new Date("2024-01-05T12:00:00")},
        {rowId: "row_id2", start: new Date("2024-01-10T11:00:00"), end: new Date("2024-01-12T12:00:00")},
        {rowId: "row_id3", start: new Date("2024-02-15T11:00:00"), end: new Date("2024-02-20T12:00:00")},
    ]
    return (
        <GanttChart
            resolution = {DateRange.CUSTOM}
            tasks = {tasks}
            startDate = {new Date("2024-01-01T00:00:00")}
            endDate = {new Date("2024-03-31T23:59:59")}
        />
    )
}
```

![demo1](https://github.com/knalum/react-minimalistic-gantt/assets/demo1.png)

### Props
- tasks: Array of `Task` objects
- resolution: `DateRange` enum `(DAY,WEEK,MONTH,CUSTOM)`
- startDate: Start of gantt interval `Date`
- endDate: End of gantt interval `Date`

### Task
Tasks are items in the gantt chart.

Tasks with equal rowId are placed on the same row.

### License
Licensed under MIT license, see LICENSE for the full license.
