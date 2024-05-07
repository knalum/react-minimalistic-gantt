import {Item} from "../GanttChart.tsx";
import {useEffect, useState} from "react";
import {formatDate, formatDateToYYYYMMDD} from "../date_utils.ts";

export default function ItemEdit(props: { item: Item, setItems: (t: Item[]) => void, items: Item[] }) {
    const [item, setItem] = useState(props.item)


    useEffect(() => {
        setItem(props.item)
    }, [props.item])

    function onSave() {
        const newItems = [...props.items]
        newItems.forEach(t => {
            if (t.id === props.item.id) {
                Object.assign(t, {...item})
            }
        })
        props.setItems(newItems)
    }

    return (
        <div>
            {item.displayName}
            <br/>
            start: {formatDate(item.start)}
            <br/>
            end: {formatDate(item.end)}
            <br/>

            <input type={"text"} value={item.displayName} onChange={e => {
                setItem({...item, displayName: e.target.value})
            }}/>

            <input type={"date"} value={formatDateToYYYYMMDD(item.start)}
                   onChange={e => {
                       const val = e.target.value
                       const date = new Date(val);
                       date.setHours(0)
                       date.setMinutes(0)
                       date.setSeconds(0)
                       setItem({...item, start: date})
                   }}
            />
            <input type={"date"} value={formatDateToYYYYMMDD(item.end)}
                   onChange={e => {
                       const val = e.target.value
                       const date = new Date(val);
                       date.setHours(23)
                       date.setMinutes(59)
                       date.setSeconds(59)
                       setItem({...item, end: date})
                   }}
            />

            <button onClick={onSave}>Save</button>
        </div>
    )
}
