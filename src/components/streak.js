import { useContext, useState } from 'react';
import {colors} from "./newStreakForm";
import axios from 'axios';
import { streaksContext } from '../contexts/streaksContext';
import { userContext } from '../contexts/userContext';
import useCounter from '../hooks/useCounter';

const incrementCounter = async (_id, streaksDispatch, token) =>
{
    const response = await axios.put(
        process.env.REACT_APP_PORT + '/streak/incrementStreak', 
        { "id": _id },
        { headers: { Authorization: `Bearer ${token}`} }
    )

    if(response.data.status) 
        streaksDispatch({
            type: 'increment',
            _id: _id
        })
    else
        alert(response.data.message)
    
}
export default function Streak({streakObject, extendStreak}) 
{   
    const {user} = useContext(userContext);
    const {streaksDispatch} = useContext(streaksContext)
    const {hours, minutes, seconds} = useCounter(streakObject)
    const colorPalette = colors[streakObject.theme]
    
    const [height, setHeight] = useState( window.innerWidth<600 ? "70px" : "100px" )
    const [collapsedHeight, setCollapsedHeight] = useState( window.innerWidth<600 ? "70px" : "100px" )


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
                    onClick={() => incrementCounter(streakObject._id, streaksDispatch, user.token)} 
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
                onClick={() => incrementCounter(streakObject._id, streaksDispatch, user.token)}
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
            style={{background: colorPalette.mainColor, color: colorPalette.fontColor, height: height}} 
            onClick={e => extendStreak(e, setHeight, setCollapsedHeight)}>

            <div className="collapsedStreak streakElements" id="collapsedData" style={{height: collapsedHeight}}>
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
                    <div className="detailElement attemptDetail">Attempts: {streakObject.numberOfAttempts}</div>
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
