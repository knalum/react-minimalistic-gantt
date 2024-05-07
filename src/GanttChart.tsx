import React, {ReactNode, useEffect, useState} from "react";
import {useWindowResize} from "./window_resize.ts";
import {dateOverlaps, getHours, getISOWeekNumber, getNumberOfDays, HourFormat} from "./date_utils.ts";
import "./style.css";

export interface GanttChartProps {
    resolution: Resolution
    items: Item[]
    startDate: Date
    endDate: Date
    options?: GanttChartOptions
    onItemClick?: (item: Item) => void
    onMouseEnter?: (item: Item) => void
    itemTooltip?: (item: Item) => ReactNode
}

export interface GanttChartOptions {
    locale?: string
    weekLiteral?: string
    hourFormat?: HourFormat
    itemRowHeight?: number
    showItemNames?: boolean
}

export function GanttChart(props: GanttChartProps) {
    const {resolution, startDate, endDate, items, options} = props;
    const itemRowHeight = options?.itemRowHeight || 20

    const windowSize = useWindowResize();

    const [filteredItems, setFilteredItems] = useState<FilteredItems[]>([])

    useEffect(() => {
        setFilteredItems(filterItems(items))
    }, [items, startDate, endDate])

    function getNumLinesForResolution(): number {
        const numdays = getNumberOfDays(startDate, endDate);
        if (resolution == Resolution.DAY) {
            return numdays + 1
        } else if (resolution == Resolution.WEEK) {
            return numdays + 1
        } else if (resolution == Resolution.MONTH) {
            return numdays + 1
        }
        throw Error("Num lines error")
    }

    function getNumLinesForResolutionBottom(): number {
        const numdays = getNumberOfDays(startDate, endDate);
        if (resolution == Resolution.DAY) {
            return 24 * numdays
        } else if (resolution == Resolution.WEEK) {
            return numdays + 1
        } else if (resolution == Resolution.MONTH) {
            return numdays + 1
        }
        throw Error("Num lines error")
    }

    function getNumHoursStepForResolutionBottomHeader(): number {
        if (resolution == Resolution.DAY) {
            const numdays = getNumberOfDays(startDate, endDate);
            return numdays
        } else if (resolution == Resolution.WEEK) {
            return 24
        } else if (resolution == Resolution.MONTH) {
            return 24
        }
        throw Error("Num hours error")
    }

    function createColumnHeaderBottom(dt: Date): string {
        if (resolution == Resolution.DAY) {
            return getHours(dt, options?.hourFormat)
        } else if (resolution == Resolution.WEEK) {
            // return dt.toLocaleDateString(options?.locale, {weekday: 'long'}) + " " + dt.getDate();
            return "" + dt.getDate()
        } else if (resolution == Resolution.MONTH) {
            return "" + dt.getDate()
        }
        throw new Error("Col error")
    }

    function createColumnHeaderTop(dt: Date): string {
        if (resolution == Resolution.DAY) {
            return dt.toLocaleDateString(options?.locale, {weekday: "long"}) + " " + dt.getDate() + "." + dt.toLocaleString("default", {month: "long"})
        } else if (resolution == Resolution.WEEK) {
            const weekLiteral = options?.weekLiteral || "Week"
            return weekLiteral + " " + (getISOWeekNumber(dt))
        } else if (resolution == Resolution.MONTH) {
            return dt.toLocaleString(options?.locale, {month: 'long'});
        }
        throw new Error("Col header top err")
    }

    function calcHeaderTop(): Line[] {
        const lines: Line[] = []

        const numCols = getNumLinesForResolution()
        let lastHeaderName = null
        for (let i = 0; i < numCols; i++) {
            const dt = new Date(getStartOfResolution().getTime())

            dt.setHours(dt.getHours() + 24 * i)

            if (resolution == Resolution.DAY) {
                if (dt.getDay() != lastHeaderName) {
                    lines.push({start: dt, column: createColumnHeaderTop(dt)})
                }
                lastHeaderName = dt.getDay()
            } else if (resolution == Resolution.WEEK) {
                if (getISOWeekNumber(dt) != lastHeaderName) {
                    lines.push({start: dt, column: createColumnHeaderTop(dt)})
                }
                lastHeaderName = getISOWeekNumber(dt)
            } else if (resolution == Resolution.MONTH) {
                if (dt.getMonth() != lastHeaderName) {
                    lines.push({start: dt, column: createColumnHeaderTop(dt)})
                }
                lastHeaderName = dt.getMonth()
            }
        }
        return lines;
    }

    function calcLinesForHeaderBottom(): Line[] {
        const lines: Line[] = []

        const numLines = getNumLinesForResolutionBottom()
        for (let i = 0; i < numLines; i++) {

            const dt = new Date(getStartOfResolution().getTime())
            dt.setHours(dt.getHours() + getNumHoursStepForResolutionBottomHeader() * i)

            let column = createColumnHeaderBottom(dt);
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
        return numLanes().length * itemRowHeight + 40;
    }

    function filterItems(items: Item[]): FilteredItems[] {
        const filteredItems: FilteredItems[] = []
        const searchStart = new Date(startDate)
        searchStart.setDate(searchStart.getDate())

        const searchEnd = new Date(endDate)
        searchEnd.setDate(searchEnd.getDate())

        let laneIndex = 0;
        const laneObj: { [rowId: string]: number } = {}
        items.filter(item => {
            if (dateOverlaps(item.start, item.end, searchStart, searchEnd)) {

                if (laneObj[item.rowId] != null) {
                    // Put on same lane
                    filteredItems.push({...item, lane: laneObj[item.rowId]})
                } else {
                    laneObj[item.rowId] = laneIndex
                    filteredItems.push({...item, lane: laneIndex})
                    laneIndex++
                }
            }
        })
        return filteredItems
    }

    const numLanes = () => {
        return Array.of(...new Set(filteredItems.map(t => t.rowId)));
    }
    const headerMargin = 40

    const headerTop = calcHeaderTop()
    const headerBottom = calcLinesForHeaderBottom()

    function calcWidth(idx: number) {
        if (idx < headerTop.length - 1) {
            return dateToX(headerTop[idx + 1].start) - dateToX(headerTop[idx].start)
        }
        return 150;
    }

    function calcWidth2(idx: number) {
        if (idx < headerBottom.length - 1) {
            return dateToX(headerBottom[idx + 1].start) - dateToX(headerBottom[idx].start)
        }
        return 100;
    }

    function calcGanttItemTextXPos(item: FilteredItems): number {
        const out = dateToX(item.start)
        return out < 0 ? 0 : out;
    }

    return (<div id={"react-minimalistic-gantt"}>
        <svg className={"row-names"} style={{height: calcSvgHeight()}}>
            {filteredItems.map((item, idx) => (
                <React.Fragment key={idx}>
                    <text x={0} y={headerMargin + itemRowHeight * item.lane + 15}>{item.rowId}</text>
                </React.Fragment>
            ))}
        </svg>
        <svg style={{width: windowSize.width, height: calcSvgHeight()}}>
            {headerTop.map((line, idx) => (<React.Fragment key={idx}>
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
            {headerBottom.map((line, idx) => (<React.Fragment key={idx}>
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

            {filteredItems.map((item, idx) => <React.Fragment key={idx}>
                    <g
                        onMouseEnter={() => props.onMouseEnter?.(item)}
                        onClick={() => props.onItemClick?.(item)} className={"gantt-item-wrapper"}>
                        <rect
                            x={dateToX(item.start)}
                            y={headerMargin + itemRowHeight * item.lane}
                            width={dateToX(item.end) - dateToX(item.start)}
                            height={itemRowHeight}
                            className={"gantt-item-rectangle"}
                        />


                        {props.options?.showItemNames && (
                            <foreignObject x={calcGanttItemTextXPos(item)}
                                           y={headerMargin + itemRowHeight * item.lane}
                                           width={dateToX(item.end) - dateToX(item.start)}
                                           height={itemRowHeight}>
                                <div style={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}>
                                    {item.displayName} - {item.id}
                                </div>
                            </foreignObject>
                        )}
                        <title>{props.itemTooltip?.(item)}</title>
                    </g>
                </React.Fragment>
            )}
        </svg>
    </div>)
}

export interface Item {
    id: string,
    rowId: string,
    displayName: string,
    start: Date,
    end: Date,
}

export interface FilteredItems extends Item {
    lane: number
}

export interface Line {
    start: Date
    column: string
}

export enum Resolution {
    DAY,
    WEEK,
    MONTH
}
