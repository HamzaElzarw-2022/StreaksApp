import { useState, useEffect, useContext } from 'react';
import {colors} from "./newStreakForm";
import axios from 'axios';
import { streaksContext } from '../contexts/streaksContext';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const delay = ms => new Promise(res => setTimeout(res, ms));
let currentlyExtendedStreak = "none"; //currently extended streak

const extendStreak = async (e) =>
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
const incrementCounter = async (_id, streaksDispatch) =>
{
    const response = await axios.put(process.env.REACT_APP_PORT + '/streak/incrementStreak', {"id": _id})

    if(response.data.status) 
        streaksDispatch({
            type: 'increment',
            _id: _id
        })
    else
        alert(response.data.message)
    
}
const checkDeadline = async (_id, streaksDispatch, expiredDispatch) =>
{
    const response = await axios.put(process.env.REACT_APP_PORT + '/streak/roundEnded', {"id": _id} )
        
    if(response.data.status === true) {
        if(response.data.action === "active") 
            streaksDispatch({
                type: 'updateRound',
                newDeadline: response.data.newRoundEnd,
                _id: _id
            })
        else {
            streaksDispatch({
                type: 'remove',
                _id: _id
            })
            expiredDispatch({
                type: 'add',
                streak: response.data.streak
            })

            document.getElementById("expiredContainer").style.height = (60 * document.getElementById("expiredContainer").childElementCount) + 70 + "px";
            if(document.getElementById(_id).offsetHeight === 500) 
                        currentlyExtendedStreak = "none";

            alert("\""+ response.data.streak.name + "\" has expired because " + response.data.message)
        }
    }
    else 
        alert(response.data.message) 
}

export default function Streak({streakObject}) 
{   
    const {streaksDispatch, expiredDispatch} = useContext(streaksContext)
    const colorPalette = colors[streakObject.theme]
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
                checkDeadline(streakObject._id, streaksDispatch, expiredDispatch)
            return newTimeSpan;
        })}, SECOND);
        return () => {clearInterval(intervalId)};

    }, [expiredDispatch, streaksDispatch, streakObject]);

    //change remaining time if deadline change
    useEffect(() => 
    {
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
                    onClick={() => incrementCounter(streakObject._id, streaksDispatch)} 
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
                onClick={() => incrementCounter(streakObject._id, streaksDispatch)}
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
