import { useState, useEffect } from 'react';
import {colors} from "../objects";
import axios from 'axios';
import retryIcon from '../retry.png'
import deleteIcon from '../delete.png'

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
let currentlyExtendedStreak = "none"; //to keep track of the currently extended streak
const delay = ms => new Promise(res => setTimeout(res, ms));
let removingStreak = false;

async function extendStreak(e) 
{
    if(e.target.tagName !== "BUTTON") {
        if(e.target.offsetHeight !== 500 ) 
        {
            
            if(currentlyExtendedStreak !== "none") {
                document.getElementById(currentlyExtendedStreak).style.height = "100px";
                document.getElementById(currentlyExtendedStreak).firstChild.style.height = "100px";
            }
            e.target.style.height = "500px";
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
        {"id": streakObject.id}
    ).then((res) => {
        console.log(res.data)

        if(res.data === true) {
            setlist(list.map((streak) => {
                if(streak.id === streakObject.id) {
                    streak.count++;
                    streak.done = true;
                }
                return streak;
            }))
        }
        else
            alert("you need to wait for the next Round !!")
    }).catch((error) => {alert(error)});
}
function checkDeadline(streakObject, setlist, list, setNotActiveStreaks) 
{
    removingStreak = true;
    axios.put('http://localhost:8080/roundEnded', 
        {"id": streakObject.id}
    ).then((res) => {
        if(res.data.status === true) {  // status is true if streak.done was true
            setlist(list.map((streak) => {
                if(streak.id === streakObject.id) {
                    streak.roundEnd = res.data.newRoundEnd;
                    streak.done = false;
                }
                return streak;
            }))
        }
        else {
            setlist(list.filter((streak) => {
                if(streak.id === streakObject.id) {
                    if(document.getElementById(streak.id).offsetHeight === 500)
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
        removingStreak = false;
    }).catch((error) => {
        alert(error)
        removingStreak = false;
    });
}

export function Streak({streakObject, setlist, list, setNotActiveStreaks}) 
{   
    const colorPalette = colors[streakObject.theme]
    const [timespan, setTimespan] = useState(new Date(streakObject.roundEnd) - Date.now());
    
    const hours = Math.floor((timespan / HOUR) % 24);
    const minutes = Math.floor((timespan / MINUTE) % 60);
    const seconds = Math.floor((timespan / SECOND) % 60);

    //change remaining time every second
    useEffect(() => { 
        console.log("power");
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
            <button disabled 
                className="incrementButton" 
                type="button"  
                onClick={() => incrementCounter(streakObject, setlist, list)} 
                style={{background: colorPalette.fontColor, color: colorPalette.mainColor}}>
                <RemainingTime />
            </button>
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
        <div key={streakObject.id} id={streakObject.id} className="streakDiv" 
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
            </div>
        </div>
    )
}
export function NotActiveStreak({streakObject, setStreaksList, streaksList, setNotActiveStreaks}) 
{
    const [isHover, setIsHover] = useState(false);
    
    function deleteExpiredStreak() {
        if (window.confirm(`are you sure you want to delete "${streakObject.name}" streak ?`)) {

            axios.put('http://localhost:8080/deleteStreak',  //----------------------------------------------------------edit server
                {"id": streakObject.id}
            ).then((res) => {
                if(res.data.status === true) {
                    setNotActiveStreaks( NotActiveStreaks => NotActiveStreaks.filter((streak)=> {
                        if(streakObject.id === streak.id)
                            return false;
                        return true
                    }))
                }
            }).catch((error) => {alert(error.message)});

        }
    }
    function retryExpiredStreak() {

        axios.put('http://localhost:8080/retryStreak',  //----------------------------------------------------------edit server
            {"id": streakObject.id}
        ).then((res) => {
            if(res.data.status === true) {
                setStreaksList( activeStreaks => [...activeStreaks, res.data.streak])

                setNotActiveStreaks( NotActiveStreaks => NotActiveStreaks.filter((streak)=> {
                    if(streakObject.id === streak.id)
                        return false;
                    return true
                }))
            }
        }).catch((error) => {alert(error.message)});

        alert("retry was pressed")
    }

    return(
        <div className="notActiveStreak" onMouseLeave={() => {setIsHover(false)}} onMouseEnter={() => {setIsHover(true)}}>
            <p className="notActiveName" >{streakObject.name}</p>
            <p className="notActiveCounter"> highest streak: {streakObject.highestStreak} </p>
            <p className="notActiveAttemts"> attempts: {streakObject.numberOfAttempts} </p>

            <div className="expiredOptionsDiv" style={{visibility: isHover ? 'visible' : 'hidden' }}>
                <img src={retryIcon} onClick={retryExpiredStreak} className="retryIcon scaleBig" alt="retryIcon" id="retryIcon"/>
                <img src={deleteIcon} onClick={deleteExpiredStreak} className="deleteIcon scaleBig" alt="deleteIcon" id="deleteIcon"/>
            </div>
            
            
            
        </div>
    );
}
