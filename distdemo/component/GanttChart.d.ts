export interface GanttChartProps {
    resolution: DateRange;
    tasks: Task[];
    startDate: Date;
    endDate: Date;
}
export declare function GanttChart(props: GanttChartProps): import("react/jsx-runtime").JSX.Element;
export interface Task {
    rowId: string;
    start: Date;
    end: Date;
}
export interface FilteredTask extends Task {
    lane: number;
}
export interface Line {
    start: Date;
    column: string;
}
export declare enum DateRange {
    DAY = 0,
    WEEK = 1,
    MONTH = 2,
    CUSTOM = 3
}
