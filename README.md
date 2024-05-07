# react-minimalistic-gantt

A minimalistic gantt component for react

#### Demo

https://knalum.github.io/react-minimalistic-gantt/

### Installation

The package can be installed via npm:

```npm i react-minimalistic-gantt```

### Usage

```ts
import {Resolution, GanttChart, Item} from "react-minimalistic-gantt"

function App() {
    const items: Item[] = [
        {id: "id1", rowId: "row_id1", start: new Date("2024-01-01T08:00:00"), end: new Date("2024-01-02T16:00:00")},
        {id: "id2", rowId: "row_id1", start: new Date("2024-01-03T11:00:00"), end: new Date("2024-01-05T12:00:00")},
        {id: "id3", rowId: "row_id2", start: new Date("2024-01-10T11:00:00"), end: new Date("2024-01-12T12:00:00")},
        {id: "id4", rowId: "row_id3", start: new Date("2024-02-15T11:00:00"), end: new Date("2024-02-20T12:00:00")},
    ]
    return (
        <GanttChart
            resolution = {Resolution.MONTH}
    items = {items}
    startDate = {new Date("2024-01-01T00:00:00")}
    endDate = {new Date("2024-03-31T23:59:59")}
    />
)
}
```

![demo1](https://github.com/knalum/react-minimalistic-gantt/blob/36faefd2b26d0bbfb3d0f382f155a83abacbccdf/assets/demo1.png?raw=true)

### Props

- items: Array of `Item` objects
- resolution: `Resolution` enum `(DAY,WEEK,MONTH)`
- startDate: Start of gantt interval `Date`
- endDate: End of gantt interval `Date`
- onItemClick: Callback when gantt item is clicked
- onMouseEnter: Callback when pointer enters gantt item
- itemTooltip: Tooltip for gantt item
- options: GanttChartOptions

Item:

- id: Unique id for an item
- rowId: Id for all items placed on same row
- displayName: String to be displayed on a gantt item
- start: Start date for a item
- end: End date for a item

GanttChartOptions:

- locale: string for displaying header names, e.g `fr`
- hourFormat: `12` or `24`
- weekLiteral: string for displaying the Week word
- itemRowHeight: number for adjusting row height for item rows
- showItemNames: boolean for showing names on gantt items

### Items

Items are shown in the gantt chart.

Items with equal rowId are placed on the same row.

### License

Licensed under MIT license, see LICENSE for the full license.
