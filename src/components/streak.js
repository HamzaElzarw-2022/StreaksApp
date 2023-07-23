import { useState, useEffect } from 'react';
import {colors} from "../objects";
import axios from 'axios';


const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
let currentlyExtendedStreak = "none"; //to keep track of the currently extended streak
const delay = ms => new Promise(res => setTimeout(res, ms));
let removingStreak = false;

async function extendStreak(e) 
{
    if(e.target.tagName !== "BUTTON") {
        if(e.target.offsetHeight !== 520 ) 
        {
            
            if(currentlyExtendedStreak !== "none") {
                document.getElementById(currentlyExtendedStreak).style.height = "100px";
                document.getElementById(currentlyExtendedStreak).firstChild.style.height = "100px";
            }
            e.target.style.height = "520px";
            currentlyExtendedStreak = e.target.id;
            e.target.firstChild.style.height = "0px";
            await delay(400);
            window.scrollTo(0,e.target.offsetTop - 72 - 85);
        }
        else 
        {
           e.target.style.height = "100px";
           e.target.firstChild.style.height = "100px";
           currentlyExtendedStreak = "none";
        }
    }
}
function incrementCounter(streakObject, setlist, list) 
{
    axios.put('http://localhost:8080/incrementStreak', 
        {"id": streakObject._id}
    ).then((res) => {
        console.log(res.data)

        if(res.data.status) {
            setlist(list.map((streak) => {
                if(streak._id === streakObject._id) {
                    streak.count++;
                    streak.done = true;
                }
                return streak;
            }))
        }
        else
            alert(res.data.message)
    }).catch((error) => {alert(error)});
}
function checkDeadline(streakObject, setlist, list, setNotActiveStreaks) 
{
    removingStreak = true;
    axios.put('http://localhost:8080/roundEnded', 
        {"id": streakObject._id}
    ).then((res) => {
        if(res.data.status === true) {  // status is true if streak.done was true

            if(res.data.action === "active") 
            {
                setlist(list.map((streak) => {
                    if(streak._id === streakObject._id) {
                        streak.roundEnd = res.data.newRoundEnd;
                        streak.done = false;
                    }
                    return streak;
                }))
            }
            else 
            {
                setlist(list.filter((streak) => {
                    if(streak._id === streakObject._id) {
                        if(document.getElementById(streak._id).offsetHeight === 500)
                            currentlyExtendedStreak = "none";
                        streak.active = false;
                        if(streak.count > streak.highestStreak)
                            streak.highestStreak = streak.count;
                        setNotActiveStreaks(prevNotActiveStreaks => [...prevNotActiveStreaks, streak]);
                        alert("\""+ streak.name + "\" has expired because " + res.data.message)
                        document.getElementById("expiredContainer").style.height = (60 * document.getElementById("expiredContainer").childElementCount) + 70 + "px";
                        return false;
                    }
                    return true;
                }))
            }
        }
        else {
            alert(res.data.message)
        }
        removingStreak = false;
    }).catch((error) => {
        alert(error)
        removingStreak = false;
    });
}

export default function Streak({streakObject, setlist, list, setNotActiveStreaks}) 
{   
    const colorPalette = colors[streakObject.theme]
    const [timespan, setTimespan] = useState(new Date(streakObject.roundEnd) - Date.now());
    
    const hours = Math.floor((timespan / HOUR) % 24);
    const minutes = Math.floor((timespan / MINUTE) % 60);
    const seconds = Math.floor((timespan / SECOND) % 60);

    //change remaining time every second
    useEffect(() => { 
        const intervalId = setInterval(() => {setTimespan((_timespan) => {

            const newTimeSpan = _timespan - SECOND;
            if(newTimeSpan <= 0 && streakObject.active === true && removingStreak === false) 
                checkDeadline(streakObject, setlist, list, setNotActiveStreaks)
            return newTimeSpan;

        })}, SECOND);
  
        return () => {
            clearInterval(intervalId);
        };
    }, [list, setNotActiveStreaks, setlist, streakObject]);
    //change remaining time according if deadline change
    useEffect(() => {
      setTimespan(new Date(streakObject.roundEnd) - Date.now());
    }, [streakObject.roundEnd]);


    function RemainingTime() {
        if(hours===0) {
            if(streakObject.done)
                return <>next round in {minutes} min {seconds} sec</>
            else
                return <>round end in {minutes} min {seconds} sec</>
        }
        else {
            if(streakObject.done)
                return <>next round in {hours} hr {minutes} min</>
            else
                return <>round end in {hours} hr {minutes} min</>
        }
    }
    function DoneStreakButton() {
        return(
            <>
                <button disabled 
                    className="incrementButton" 
                    type="button"  
                    onClick={() => incrementCounter(streakObject, setlist, list)} 
                    style={{background: colorPalette.fontColor, color: colorPalette.mainColor}}>
                    <RemainingTime />
                </button>
                <p className="emptyExStreak"></p>
            </>
        )
    }
    function NotDoneStreakButton() {
        return(
            <>
            <button 
                className="incrementButton" 
                type="button"  
                onClick={() => incrementCounter(streakObject, setlist, list)}
                style={{background: colorPalette.fontColor, color: colorPalette.mainColor}}>
                Done
            </button>
            <p className="streakElements exStreakState">
                <RemainingTime />
            </p>
            </>
        )
    }

    return (
        <div key={streakObject._id} id={streakObject._id} className="streakDiv" 
            style={{background: colorPalette.mainColor, color: colorPalette.fontColor}} 
            onClick={e => extendStreak(e)}>

            <div className="collapsedStreak streakElements" id="collapsedData">
                <p className="streakCount streakElements" >{streakObject.count}<span className="sub">days</span></p> 
                <p className="streakName streakElements">{streakObject.name}</p>
                <p className="streakState streakElements"><RemainingTime /></p>
            </div>
            
            <div className="extendedStreak  streakElements" id="extendedData">
                
                <p className="streakElements exStreakName">{streakObject.name}</p>
                <p className="streakElements exStreakCount" >{streakObject.count}<span className="exsub">days</span></p>
                { streakObject.done ? <DoneStreakButton /> : <NotDoneStreakButton />}
                <div className="divider" style={{background: colorPalette.fontColor}}></div>
                <div className="streakDetails">
                    <div className="detailElement">Attempts: {streakObject.numberOfAttempts}</div>
                    <div className="detailElement highestStreakDetail">Highest Streak: {streakObject.highestStreak}</div>
                    <div className="detailElement">Update time: {
                        new Date(streakObject.roundEnd).getHours() > 12 ? 
                        (new Date(streakObject.roundEnd).getHours()-12)+" pm" : 
                        (new Date(streakObject.roundEnd).getHours())+" am"
                    }</div>
                </div>
            </div>
        </div>
    )
}
