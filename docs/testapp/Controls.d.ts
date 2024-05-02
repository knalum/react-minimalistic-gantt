import { DateRange } from '../component/GanttChart.tsx';
import { default as React } from 'react';

export interface ControlsProps {
    resolution: DateRange;
    setResolution: React.Dispatch<React.SetStateAction<DateRange>>;
    startDate: Date;
    setStartDate: React.Dispatch<React.SetStateAction<Date>>;
    endDate: Date;
    setEndDate: React.Dispatch<React.SetStateAction<Date>>;
}
export declare function Controls(props: ControlsProps): import("react/jsx-runtime").JSX.Element;
export declare function initStartDate(dt: Date, resolution: DateRange): Date;
export declare function initEndDate(dt: Date, resolution: DateRange): Date;
