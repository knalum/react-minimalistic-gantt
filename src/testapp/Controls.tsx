import React from "react";
import {formatDate, formatDateToYYYYMMDD, getEndOfWeek, getStartOfWeek} from "../date_utils.ts";
import {Resolution} from "../GanttChart.tsx";

export interface ControlsProps {
    resolution: Resolution
    setResolution: React.Dispatch<React.SetStateAction<Resolution>>
    startDate: Date
    setStartDate: React.Dispatch<React.SetStateAction<Date>>
    endDate: Date
    setEndDate: React.Dispatch<React.SetStateAction<Date>>
}


export function Controls(props: ControlsProps) {
    const {resolution, setResolution, startDate, endDate, setEndDate, setStartDate} = props;

    const onClickPrevious = () => {
        const newStartDate = new Date(startDate)
        if (resolution == Resolution.MONTH) {
            newStartDate.setMonth(startDate.getMonth() - 1)
        } else if (resolution == Resolution.WEEK) {
            newStartDate.setDate(newStartDate.getDate() - 7)
        } else if (resolution == Resolution.DAY) {
            newStartDate.setDate(startDate.getDate() - 1)
        }
        newStartDate.setHours(0)
        newStartDate.setMinutes(0)
        setStartDate(newStartDate)

        const newEndDate = new Date(newStartDate)
        if (resolution == Resolution.MONTH) {
            newEndDate.setMonth(newStartDate.getMonth() + 1)
            newEndDate.setDate(newEndDate.getDate() - 1)
        } else if (resolution == Resolution.WEEK) {
            newEndDate.setDate(newEndDate.getDate() + 6)
        } else if (resolution == Resolution.DAY) {
            newEndDate.setDate(newStartDate.getDate())
        }
        newEndDate.setHours(23)
        newEndDate.setMinutes(59)
        setEndDate(newEndDate)
    };

    const onClickNext = () => {
        const newStartDate = new Date(startDate)
        if (resolution == Resolution.MONTH) {
            newStartDate.setMonth(startDate.getMonth() + 1)
        } else if (resolution == Resolution.WEEK) {
            newStartDate.setDate(newStartDate.getDate() + 7)
        } else if (resolution == Resolution.DAY) {
            newStartDate.setDate(startDate.getDate() + 1)
        }
        newStartDate.setHours(0)
        newStartDate.setMinutes(0)
        setStartDate(newStartDate)

        const newEndDate = new Date(newStartDate)
        if (resolution == Resolution.MONTH) {
            newEndDate.setMonth(newStartDate.getMonth() + 1)
            newEndDate.setDate(newEndDate.getDate() - 1)
        } else if (resolution == Resolution.WEEK) {
            newEndDate.setDate(newStartDate.getDate() + 7)
        } else if (resolution == Resolution.DAY) {
            newEndDate.setDate(newStartDate.getDate())
        }
        newEndDate.setHours(23)
        newEndDate.setMinutes(59)
        setEndDate(newEndDate)
    };

    const onChangeResolutionCb = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newResolution: Resolution = e.target.value as unknown as Resolution;
        setResolution(() => (newResolution))

        /*
        const newStartDate = initStartDate(new Date(startDate), newResolution);
        setStartDate(() => newStartDate)
        setEndDate(() => initEndDate(new Date(newStartDate), newResolution))
         */
    };
    return (<div style={{display: "flex", gap: 10}}>

        <div>
            <label htmlFor={"resolution"}>Resolution: </label>
            <select id={"resolution"} onChange={onChangeResolutionCb} value={props.resolution}>
                <option value={"0"}>Day</option>
                <option value={"1"}>Week</option>
                <option value={"2"}>Month</option>
            </select>

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
        </div>


        <div>
            Start: {formatDate(startDate)} - End: {formatDate(endDate)}
        </div>

        <button onClick={() => {
            setStartDate(new Date())
            setEndDate(new Date())
        }}>Reset
        </button>

        <div>
            <button onClick={onClickPrevious}>Previous
            </button>
            <button onClick={onClickNext}>Next
            </button>
        </div>
    </div>)
}

export function initStartDate(dt: Date, resolution: Resolution) {
    let newDate = new Date(dt)
    if (resolution == Resolution.DAY) {
        //Noop
    } else if (resolution == Resolution.WEEK) {
        newDate = getStartOfWeek(newDate)
    } else if (resolution == Resolution.MONTH) {
        newDate.setDate(1)
    }

    newDate.setHours(0)
    newDate.setMinutes(0)
    newDate.setSeconds(0)
    return newDate;
}

export function initEndDate(dt: Date, resolution: Resolution) {
    let newDate = new Date(dt)
    if (resolution == Resolution.WEEK) {
        newDate = getEndOfWeek(newDate)
    }
    if (resolution == Resolution.MONTH) {
        newDate.setMonth(newDate.getMonth() + 1);
        newDate.setDate(0);
    }
    newDate.setHours(23)
    newDate.setMinutes(59)
    newDate.setSeconds(59)
    return newDate
}

