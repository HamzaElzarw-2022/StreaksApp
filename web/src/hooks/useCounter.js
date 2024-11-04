import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { userContext } from "../contexts/userContext";
import { streaksContext } from "../contexts/streaksContext";
import useCheckDeadline from "./useCheckDeadline";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

export default function useCounter(streakObject) {

    const {checkDeadline} = useCheckDeadline(streakObject._id);
    const [timespan, setTimespan] = useState(new Date(streakObject.roundEnd) - Date.now());
    
    const hours = Math.floor((timespan / HOUR) % 24);
    const minutes = Math.floor((timespan / MINUTE) % 60);
    const seconds = Math.floor((timespan / SECOND) % 60);
    
    //change remaining time every second
    useEffect(() => 
    { 
        const intervalId = setInterval(() => {setTimespan((_timespan) => {

            const newTimeSpan = _timespan - SECOND;
            if(newTimeSpan <= 0 && streakObject.active) 
                checkDeadline();
                
            return newTimeSpan;
        })}, SECOND);
        return () => {clearInterval(intervalId)};

    }, [checkDeadline, streakObject.active]);

    //change remaining time if deadline change
    useEffect(() => 
    {
      setTimespan(new Date(streakObject.roundEnd) - Date.now());
    }, [streakObject.roundEnd]);

    return {hours, minutes, seconds}

}