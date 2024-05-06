import {Task} from "../GanttChart.tsx";
import {useEffect, useState} from "react";
import {formatDateToYYYYMMDD} from "../date_utils.ts";

export default function TaskEdit(props: { task: Task, setTasks: (t: Task[]) => void, tasks: Task[] }) {
    const [task, setTask] = useState(props.task)


    useEffect(() => {
        setTask(props.task)
    }, [props.task])

    function onSave() {
        const newTasks = [...props.tasks]
        newTasks.forEach(t => {
            if (t.rowId === props.task.rowId) {
                Object.assign(t, {...task})
            }
        })
        props.setTasks(newTasks)
    }

    return (
        <div>
            Edit
            {JSON.stringify(props.task, null, " ")}

            <input type={"text"} value={task.displayName} onChange={e => {
                setTask({...task, displayName: e.target.value})
            }}/>

            <input type={"date"} value={formatDateToYYYYMMDD(task.start)}
                   onChange={e => {
                       const val = e.target.value
                       const date = new Date(val);
                       date.setHours(0)
                       date.setMinutes(0)
                       date.setSeconds(0)
                       setTask({...task, start: date})
                   }}
            />
            <input type={"date"} value={formatDateToYYYYMMDD(task.end)}
                   onChange={e => {
                       const val = e.target.value
                       const date = new Date(val);
                       date.setHours(23)
                       date.setMinutes(59)
                       date.setSeconds(59)
                       setTask({...task, end: date})
                   }}
            />

            <button onClick={onSave}>Save</button>
        </div>
    )
}
