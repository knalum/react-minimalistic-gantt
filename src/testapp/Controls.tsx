import React from "react";
import {formatDate, formatDateToYYYYMMDD, getEndOfWeek, getStartOfWeek} from "../date_utils.ts";
import {DateRange} from "../GanttChart.tsx";

export interface ControlsProps {
    dateRange: DateRange
    setDateRange: React.Dispatch<React.SetStateAction<DateRange>>
    startDate: Date
    setStartDate: React.Dispatch<React.SetStateAction<Date>>
    endDate: Date
    setEndDate: React.Dispatch<React.SetStateAction<Date>>
}


export function Controls(props: ControlsProps) {
    const {dateRange, setDateRange, startDate, endDate, setEndDate, setStartDate} = props;

    const onClickPrevious = () => {
        const newStartDate = new Date(startDate)
        if (dateRange == DateRange.MONTH) {
            newStartDate.setMonth(startDate.getMonth() - 1)
        } else if (dateRange == DateRange.WEEK) {
            newStartDate.setDate(newStartDate.getDate() - 7)
        } else if (dateRange == DateRange.DAY) {
            newStartDate.setDate(startDate.getDate() - 1)
        }
        newStartDate.setHours(0)
        newStartDate.setMinutes(0)
        setStartDate(newStartDate)

        const newEndDate = new Date(newStartDate)
        if (dateRange == DateRange.MONTH) {
            newEndDate.setMonth(newStartDate.getMonth() + 1)
            newEndDate.setDate(newEndDate.getDate() - 1)
        } else if (dateRange == DateRange.WEEK) {
            newEndDate.setDate(newEndDate.getDate() + 6)
        } else if (dateRange == DateRange.DAY) {
            newEndDate.setDate(newStartDate.getDate())
        }
        newEndDate.setHours(23)
        newEndDate.setMinutes(59)
        setEndDate(newEndDate)
    };

    const onClickNext = () => {
        const newStartDate = new Date(startDate)
        if (dateRange == DateRange.MONTH) {
            newStartDate.setMonth(startDate.getMonth() + 1)
        } else if (dateRange == DateRange.WEEK) {
            newStartDate.setDate(newStartDate.getDate() + 7)
        } else if (dateRange == DateRange.DAY) {
            newStartDate.setDate(startDate.getDate() + 1)
        }
        newStartDate.setHours(0)
        newStartDate.setMinutes(0)
        setStartDate(newStartDate)

        const newEndDate = new Date(newStartDate)
        if (dateRange == DateRange.MONTH) {
            newEndDate.setMonth(newStartDate.getMonth() + 1)
            newEndDate.setDate(newEndDate.getDate() - 1)
        } else if (dateRange == DateRange.WEEK) {
            newEndDate.setDate(newStartDate.getDate() + 7)
        } else if (dateRange == DateRange.DAY) {
            newEndDate.setDate(newStartDate.getDate())
        }
        newEndDate.setHours(23)
        newEndDate.setMinutes(59)
        setEndDate(newEndDate)
    };

    const onChangeDateRangeCb = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDateRange: DateRange = e.target.value as unknown as DateRange;
        setDateRange(() => (newDateRange))

        const newStartDate = initStartDate(new Date(startDate), newDateRange);
        setStartDate(() => newStartDate)
        setEndDate(() => initEndDate(new Date(newStartDate), newDateRange))
    };
    return (<div style={{display: "flex", gap: 10}}>

        <div>
            <label htmlFor={"dateRange"}>Date range: </label>
            <select id={"dateRange"} onChange={onChangeDateRangeCb} value={props.dateRange}>
                <option value={"0"}>Day</option>
                <option value={"1"}>Week</option>
                <option value={"2"}>Month</option>
                <option value={"3"}>Custom</option>
            </select>

            {dateRange == DateRange.CUSTOM && (
                <>
                    <label htmlFor={"start"}>Start</label>
                    <input type={"date"} id={"start"} defaultValue={formatDateToYYYYMMDD(startDate)}
                           onBlur={e => {
                               const val = e.target.value
                               const date = new Date(val);
                               date.setHours(0)
                               date.setMinutes(0)
                               date.setSeconds(0)
                               setStartDate(date)
                           }}/>
                    <label htmlFor={"end"}>End</label>
                    <input type={"date"} id={"end"} defaultValue={formatDateToYYYYMMDD(endDate)}
                           onBlur={e => {
                               const val = e.target.value
                               const date = new Date(val);
                               date.setHours(0)
                               date.setMinutes(0)
                               date.setSeconds(0)
                               setEndDate(date)
                           }}/>
                </>
            )}
        </div>


        <div>
            Start: {formatDate(startDate)} - End: {formatDate(endDate)}
        </div>

        {dateRange == DateRange.CUSTOM && (
            <button onClick={() => {
                setStartDate(new Date())
                setEndDate(new Date())
            }}>Reset</button>
        )}

        {dateRange != DateRange.CUSTOM && (
            <div>
                <button onClick={onClickPrevious}>Previous
                </button>
                <button onClick={onClickNext}>Next
                </button>
            </div>
        )}
    </div>)
}

export function initStartDate(dt: Date, dateRange: DateRange) {
    let newDate = new Date(dt)
    if (dateRange == DateRange.DAY) {
        //Noop
    } else if (dateRange == DateRange.WEEK) {
        newDate = getStartOfWeek(newDate)
    } else if (dateRange == DateRange.MONTH) {
        newDate.setDate(1)
    }

    newDate.setHours(0)
    newDate.setMinutes(0)
    newDate.setSeconds(0)
    return newDate;
}

export function initEndDate(dt: Date, dateRange: DateRange) {
    let newDate = new Date(dt)
    if (dateRange == DateRange.WEEK) {
        newDate = getEndOfWeek(newDate)
    }
    if (dateRange == DateRange.MONTH) {
        newDate.setMonth(newDate.getMonth() + 1);
        newDate.setDate(0);
    }
    newDate.setHours(23)
    newDate.setMinutes(59)
    newDate.setSeconds(59)
    return newDate
}

