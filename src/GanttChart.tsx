import React, {useEffect, useState} from "react";
import {useWindowResize} from "./window_resize.ts";
import {dateOverlaps, formatDate, getISOWeekNumber, getNumberOfDays} from "./date_utils.ts";

export interface GanttChartProps {
    resolution: DateRange
    tasks: Task[]
    startDate: Date
    endDate: Date
}

export function GanttChart(props: GanttChartProps) {
    const {resolution, startDate, endDate, tasks} = props
    const windowSize = useWindowResize();

    const [filteredTasks, setFilteredTasks] = useState<FilteredTask[]>([])

    useEffect(() => {
        setFilteredTasks(filterTasks(tasks))
    }, [tasks, startDate, endDate])

    function getNumLinesForResolution(): number {
        if (resolution == DateRange.DAY) {
            return 25
        } else if (resolution == DateRange.WEEK) {
            return 8
        } else if (resolution == DateRange.MONTH) {
            return 32
        } else if (resolution == DateRange.CUSTOM) {
            const numDays = getNumberOfDays(startDate, endDate)
            return numDays + 2
        }
        throw Error("Num lines error")
    }

    function getNumHoursStepForResolution(): number {
        if (resolution == DateRange.DAY) {
            return 1
        } else if (resolution == DateRange.WEEK) {
            return 24
        } else if (resolution == DateRange.MONTH) {
            return 24
        } else if (resolution == DateRange.CUSTOM) {
            const numDays = getNumberOfDays(startDate, endDate)
            if (numDays > 60) {
                return 24 * 3
            }
            if (numDays > 30) {
                return 24 * 2
            }
            return 24
        }
        throw Error("Num hours error")
    }

    function createColumnHeader(dt: Date): string {
        const options = {weekday: 'long'};
        if (resolution == DateRange.DAY) {
            // @ts-expect-error foo
            return dt.getHours()
        } else if (resolution == DateRange.WEEK) {
            // @ts-expect-error foo
            return dt.toLocaleDateString('en-US', options) + " " + dt.getDate();
        } else if (resolution == DateRange.MONTH) {
            return "" + dt.getDate()
        } else if (resolution == DateRange.CUSTOM) {
            return "" + dt.getDate()
        }
        throw new Error("Col error")
    }

    function createColumnHeaderTop(dt: Date): string {
        if (resolution == DateRange.DAY) {
            return dt.toLocaleDateString("default", {weekday: "long"}) + " " + dt.getDate() + "." + dt.toLocaleString("default", {month: "long"})
        } else if (resolution == DateRange.WEEK) {
            return "Week " + (getISOWeekNumber(dt) + 1)
        } else if (resolution == DateRange.MONTH) {
            return dt.toLocaleString('default', {month: 'long'});
        } else if (resolution == DateRange.CUSTOM) {
            return dt.toLocaleString('default', {month: 'long'});
        }
        throw new Error("Col header top err")
    }

    function calcHeader1(): Line[] {
        const lines: Line[] = []

        const numCols = getNumLinesForResolution()
        let lastMonth = null
        for (let i = 0; i < numCols; i++) {
            const dt = new Date(getStartOfResolution().getTime())

            dt.setHours(dt.getHours() + 24 * i)
            if (dt.getMonth() != lastMonth) {
                lines.push({start: dt, column: createColumnHeaderTop(dt)})
            }
            lastMonth = dt.getMonth()
        }
        return lines;
    }

    function calcLines(): Line[] {
        const lines: Line[] = []

        const numLines = getNumLinesForResolution()

        for (let i = 0; i < numLines; i++) {

            const dt = new Date(getStartOfResolution().getTime())
            dt.setHours(dt.getHours() + getNumHoursStepForResolution() * i)

            let column = createColumnHeader(dt);
            if (i == numLines - 1) {
                column = ""
            }
            lines.push({start: dt, column: column})
        }
        return lines;
    }

    function getStartOfResolution(): Date {
        return startDate;
    }

    function getEndOfResolution(): Date {
        return endDate;
    }

    function dateToX(date: Date): number {
        const startSec = date.getTime() - getStartOfResolution().getTime();
        const interval = getEndOfResolution().getTime() - getStartOfResolution().getTime()
        return windowSize.width * startSec / interval
    }

    const calcSvgHeight = () => {
        return numLanes().length * 20 + 40;
    }

    function filterTasks(tasks: Task[]): FilteredTask[] {
        const filteredTasks: FilteredTask[] = []
        const searchStart = new Date(startDate)
        searchStart.setDate(searchStart.getDate())

        const searchEnd = new Date(endDate)
        searchEnd.setDate(searchEnd.getDate())

        let laneIndex = 0;
        const laneObj: { [rowId: string]: number } = {}
        tasks.filter(task => {
            if (dateOverlaps(task.start, task.end, searchStart, searchEnd)) {

                if (laneObj[task.rowId] != null) {
                    // Put on same lane
                    filteredTasks.push({...task, lane: laneObj[task.rowId]})
                } else {
                    laneObj[task.rowId] = laneIndex
                    filteredTasks.push({...task, lane: laneIndex})
                    laneIndex++
                }
            }
        })
        return filteredTasks
    }

    const numLanes = () => {
        return Array.of(...new Set(filteredTasks.map(t => t.rowId)));
    }
    const headerMargin = 40

    return (<>
        <svg style={{width: 150, height: calcSvgHeight()}}>
            {filteredTasks.map((task, idx) => (
                <React.Fragment key={idx}>
                    <text x={0} y={headerMargin + 20 * task.lane + 15}>{task.rowId}</text>
                </React.Fragment>
            ))}
        </svg>
        <svg style={{width: windowSize.width, height: calcSvgHeight()}}>
            {calcHeader1().map((line, idx) => (<React.Fragment key={idx}>
                    <line x1={dateToX(line.start)}
                          x2={dateToX(line.start)}
                          y1={0}
                          y2={20}
                          stroke={"grey"}/>
                    <text x={dateToX(line.start)} y={15}>{line.column}</text>
                </React.Fragment>
            ))}
            <line x1={0} x2={windowSize.width} y1={20} y2={20} stroke={"grey"}/>
            {calcLines().map((line, idx) => (<React.Fragment key={idx}>
                    <text x={dateToX(line.start) + 5} y={15 + 20}>{line.column}</text>
                    <line x1={dateToX(line.start)}
                          x2={dateToX(line.start)}
                          y1={20}
                          y2={calcSvgHeight()}
                          stroke={"grey"}/>
                </React.Fragment>
            ))}

            {numLanes().map((_, idx) => (
                idx % 2 == 0 && (
                    <rect
                        key={idx}
                        x={0}
                        y={headerMargin + 20 * idx}
                        width={windowSize.width}
                        height={20}
                        fill={"rgba(100,100,100,0.2)"}
                    />
                )
            ))}

            {filteredTasks.map((task, idx) => <React.Fragment key={idx}>
                    <rect
                        x={dateToX(task.start)}
                        y={headerMargin + 20 * task.lane}
                        width={dateToX(task.end) - dateToX(task.start)}
                        height={20}
                        fill={"green"}
                    >
                        <title>{formatDate(task.start)} - {formatDate(task.end)}</title>
                    </rect>

                    <text
                        x={dateToX(task.start)}
                        y={headerMargin + 20 * task.lane + 15}
                    >

                        <title>{formatDate(task.start)} - {formatDate(task.end)}</title>
                        {task.rowId}</text>
                </React.Fragment>
            )}
        </svg>
        {/*<pre>{JSON.stringify(filteredTasks(), null, " ")}</pre>*/}
    </>)
}

export interface Task {
    rowId: string,
    start: Date,
    end: Date,
}

export interface FilteredTask extends Task {
    lane: number
}

export interface Line {
    start: Date
    column: string
}

export enum DateRange {
    DAY,
    WEEK,
    MONTH,
    CUSTOM
}