import { useState, useEffect } from 'react';
import {colors} from "../objects";
import axios from 'axios';

//each block of streak
let extendedStreak = "0";
const delay = ms => new Promise(res => setTimeout(res, ms));

async function extendStreak(e) 
{
    if(e.target.tagName !== "BUTTON") {
        if(e.target.offsetHeight !== 500 ) 
        {
            
            document.getElementById(extendedStreak).style.height = "100px";
            document.getElementById(extendedStreak).firstChild.style.height = "100px";
            e.target.style.height = "500px";
            extendedStreak = e.target.id;
            e.target.firstChild.style.height = "0px";
            await delay(400);
            // console.log(e.target.getBoundingClientRect());
            // console.log(e.target.offsetTop);
            window.scrollTo(0,e.target.offsetTop - 72 - 85);
        }
        else 
        {
           e.target.style.height = "100px";
           e.target.firstChild.style.height = "100px";
        }
    }
}

export default function Streak(streakObject, {setlist, list}) 
{   
    
    const colorPalette = colors[streakObject.theme]
    // const [hours, setHours] = useState(0);
    // const [minutes, setMinutes] = useState(0);
    // const [seconds, setSeconds] = useState(0);

    // const getTime = () => {
    //     const time = streakObject.roundEnd - Date.now();

    //     setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    //     setMinutes(Math.floor((time / 1000 / 60) % 60));
    //     setSeconds(Math.floor((time / 1000) % 60));
    // };

    // useEffect(() => {
    //     const interval = setInterval(() => getTime(), 1000);

    //     return () => clearInterval(interval);
    // }, []);

    function incrementCounter() 
    {
        //woooooow it worked (subhan Allah)
        axios.put('http://localhost:8080/incrementStreak', 
            {"id": streakObject.id}

        ).then((res) => {
            console.log(res.data)

            if(res.data == true) {
                setlist(list.map((streak, id) => {
                    if(id === streakObject.id) 
                        streak.count++;
                    return streak;
                }))
            }
            else {
                alert("you need to wait for the next Round !!")
            }
        }).catch((error) => {alert(error)});
    }

    return (
        <div key={streakObject.id} id={streakObject.id} className="streakDiv" 
            style={{background: colorPalette.mainColor, color: colorPalette.fontColor}} 
            onClick={e => extendStreak(e)}>

            <div className="collapsedStreak streakElements" id="collapsedData">
                <p className="streakCount streakElements" >{streakObject.count}<span className="sub">days</span></p> 
                <p className="streakName streakElements">{streakObject.name}</p>
                <p className="streakState streakElements">next click in 24h</p>
            </div>

            <div className="extendedStreak  streakElements" id="extendedData">
                <p className="streakElements exStreakName">{streakObject.name}</p>
                <p className="streakElements exStreakCount" >{streakObject.count}<span className="exsub">days</span></p>
                <button className="incrementButton" type="button"  onClick={incrementCounter}
                    style={{background: colorPalette.fontColor, color: colorPalette.mainColor}}>Done</button>
                <p className="streakElements exStreakState">next click in </p>
            </div>

        </div>
    )
}