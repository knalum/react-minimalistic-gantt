import React, {ReactNode, useEffect, useState} from "react";
import {useWindowResize} from "./window_resize.ts";
import {dateOverlaps, getHours, getISOWeekNumber, getNumberOfDays, HourFormat} from "./date_utils.ts";
import "./style.css";

export interface GanttChartProps {
    dateRange: DateRange
    tasks: Task[]
    startDate: Date
    endDate: Date
    options?: GanttChartOptions
    onItemClick?: (task: Task) => void
    onMouseEnter?: (task: Task) => void
    itemTooltip?: (task: Task) => ReactNode
}

export interface GanttChartOptions {
    locale?: string
    weekLiteral?: string
    hourFormat?: HourFormat
    itemRowHeight?: number
    showItemNames?: boolean
}

export function GanttChart(props: GanttChartProps) {
    const {dateRange, startDate, endDate, tasks, options} = props;
    const itemRowHeight = options?.itemRowHeight || 20

    const windowSize = useWindowResize();

    const [filteredTasks, setFilteredTasks] = useState<FilteredTask[]>([])

    useEffect(() => {
        setFilteredTasks(filterTasks(tasks))
    }, [tasks, startDate, endDate])

    function getNumLinesForDateRange(): number {
        if (dateRange == DateRange.DAY) {
            return 25
        } else if (dateRange == DateRange.WEEK) {
            return 8
        } else if (dateRange == DateRange.MONTH) {
            return 32
        } else if (dateRange == DateRange.CUSTOM) {
            const numDays = getNumberOfDays(startDate, endDate)
            return numDays + 2
        }
        throw Error("Num lines error")
    }

    function getNumHoursStepForDateRange(): number {
        if (dateRange == DateRange.DAY) {
            return 1
        } else if (dateRange == DateRange.WEEK) {
            return 24
        } else if (dateRange == DateRange.MONTH) {
            return 24
        } else if (dateRange == DateRange.CUSTOM) {
            return getNumberOfDays(startDate, endDate);
        }
        throw Error("Num hours error")
    }

    function createColumnHeader(dt: Date): string {
        if (dateRange == DateRange.DAY) {
            return getHours(dt, options?.hourFormat)
        } else if (dateRange == DateRange.WEEK) {
            return dt.toLocaleDateString(options?.locale, {weekday: 'long'}) + " " + dt.getDate();
        } else if (dateRange == DateRange.MONTH) {
            return "" + dt.getDate()
        } else if (dateRange == DateRange.CUSTOM) {
            return "" + dt.getDate()
        }
        throw new Error("Col error")
    }

    function createColumnHeaderTop(dt: Date): string {
        if (dateRange == DateRange.DAY) {
            return dt.toLocaleDateString(options?.locale, {weekday: "long"}) + " " + dt.getDate() + "." + dt.toLocaleString("default", {month: "long"})
        } else if (dateRange == DateRange.WEEK) {
            const weekLiteral = options?.weekLiteral || "Week"
            return weekLiteral + " " + (getISOWeekNumber(dt) + 1)
        } else if (dateRange == DateRange.MONTH) {
            return dt.toLocaleString(options?.locale, {month: 'long'});
        } else if (dateRange == DateRange.CUSTOM) {
            return dt.toLocaleString(options?.locale, {month: 'long'});
        }
        throw new Error("Col header top err")
    }

    function calcHeader1(): Line[] {
        const lines: Line[] = []

        const numCols = getNumLinesForDateRange()
        let lastMonth = null
        for (let i = 0; i < numCols; i++) {
            const dt = new Date(getStartOfDateRange().getTime())

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

        const numLines = getNumLinesForDateRange()

        for (let i = 0; i < numLines; i++) {

            const dt = new Date(getStartOfDateRange().getTime())
            dt.setHours(dt.getHours() + getNumHoursStepForDateRange() * i)

            let column = createColumnHeader(dt);
            if (i == numLines - 1) {
                column = ""
            }
            lines.push({start: dt, column: column})
        }
        return lines;
    }

    function getStartOfDateRange(): Date {
        return startDate;
    }

    function getEndOfDateRange(): Date {
        return endDate;
    }

    function dateToX(date: Date): number {
        const startSec = date.getTime() - getStartOfDateRange().getTime();
        const interval = getEndOfDateRange().getTime() - getStartOfDateRange().getTime()
        return windowSize.width * startSec / interval
    }

    const calcSvgHeight = () => {
        return numLanes().length * itemRowHeight + 40;
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

    const header1 = calcHeader1()
    const header2 = calcLines()

    function calcWidth(idx: number) {
        if (idx < header1.length - 1) {
            return dateToX(header1[idx + 1].start) - dateToX(header1[idx].start)
        }
        return 150;
    }

    function calcWidth2(idx: number) {
        if (idx < header2.length - 1) {
            return dateToX(header2[idx + 1].start) - dateToX(header2[idx].start)
        }
        return 100;
    }

    function calcGanttItemTextXPos(task: FilteredTask): number {
        const out = dateToX(task.start)
        return out < 0 ? 0 : out;
    }

    return (<div id={"react-minimalistic-gantt"}>
        <svg className={"row-names"} style={{height: calcSvgHeight()}}>
            {filteredTasks.map((task, idx) => (
                <React.Fragment key={idx}>
                    <text x={0} y={headerMargin + itemRowHeight * task.lane + 15}>{task.rowId}</text>
                </React.Fragment>
            ))}
        </svg>
        <svg style={{width: windowSize.width, height: calcSvgHeight()}}>
            {header1.map((line, idx) => (<React.Fragment key={idx}>
                    <line x1={dateToX(line.start)}
                          x2={dateToX(line.start)}
                          y1={0}
                          y2={20}
                          stroke={"grey"}

                    />

                    <foreignObject x={dateToX(line.start)}
                                   width={calcWidth(idx)}
                                   height="100">
                        <div style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                        }}>
                            {line.column}
                        </div>
                    </foreignObject>
                </React.Fragment>
            ))}
            <line x1={0} x2={windowSize.width} y1={20} y2={20} stroke={"grey"}/>
            {header2.map((line, idx) => (<React.Fragment key={idx}>
                    <foreignObject x={dateToX(line.start)}
                                   y={20}
                                   width={calcWidth2(idx)}
                                   height="20">
                        <div style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                        }}>
                            {line.column}
                        </div>
                    </foreignObject>

                    <line x1={dateToX(line.start)}
                          x2={dateToX(line.start)}
                          y1={20}
                          y2={calcSvgHeight()}
                          className={"vertical-line"}
                    />
                </React.Fragment>
            ))}

            {numLanes().map((_, idx) => (
                idx % 2 == 0 && (
                    <rect
                        key={idx}
                        x={0}
                        y={headerMargin + itemRowHeight * idx}
                        width={windowSize.width}
                        height={itemRowHeight}
                        className={"lane-background"}
                    />
                )
            ))}

            {filteredTasks.map((task, idx) => <React.Fragment key={idx}>
                    <g
                        onMouseEnter={() => props.onMouseEnter?.(task)}
                        onClick={() => props.onItemClick?.(task)} className={"gantt-item-wrapper"}>
                        <rect
                            x={dateToX(task.start)}
                            y={headerMargin + itemRowHeight * task.lane}
                            width={dateToX(task.end) - dateToX(task.start)}
                            height={itemRowHeight}
                            className={"gantt-item-rectangle"}
                        />


                        {props.options?.showItemNames && (
                            <foreignObject x={calcGanttItemTextXPos(task)}
                                           y={headerMargin + itemRowHeight * task.lane}
                                           width={dateToX(task.end) - dateToX(task.start)}
                                           height={itemRowHeight}>
                                <div style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}>
                                    {task.displayName} - {task.id}
                                </div>
                            </foreignObject>
                        )}
                        <title>{props.itemTooltip?.(task)}</title>
                    </g>
                </React.Fragment>
            )}
        </svg>
    </div>)
}

export interface Task {
    id: string,
    rowId: string,
    displayName: string,
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
