import {useEffect, useState} from "react";

export function useWindowResize(){
    const offset =200;
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth-offset,
        height: window.innerHeight
    });

    useEffect(() => {

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth-offset,
                height: window.innerHeight
            });
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowSize;
}
