import "./app.css";
import { useState, useEffect } from 'react';
import Streak from './components/streak.js';
import NewStreakForm from './components/newStreakForm.js';
import axios from 'axios';

//TODO
//link font color in the list with element
//fix the scroll and form problem
//read and write data
//start the time 
//drag and drop

function formVisibility() 
{
    if (document.getElementById("newStreakForm").offsetHeight === 0) {
        document.getElementById("newStreakForm").style.height = "380px";
    }
    else {
        document.getElementById("newStreakForm").style.height = "0px";
    }
}

//main component that contain all components
export default function App() {

    const [streaksList, setStreaksList] = useState([]);

    useEffect(()=>{

        axios.get('http://localhost:8080/getStreaks')
        .then(function(response) {
            console.log(response);
            setStreaksList(response.data);
        })

    }, []);

    return (
        <div>
            <TitleBar showForm={formVisibility}/>
            <NewStreakForm hideForm={formVisibility} list={streaksList} setlist={setStreaksList}/>
            <StreaksContainer list={streaksList} setlist={setStreaksList}/>
        </div>
    );
}

//the bar at the top of the website
function TitleBar({showForm}) {
    return (
        <div className= "titleDiv">
            <span className="title">🔥My Streaks</span> 
            <button className="newStreakButton" type="button" onClick={showForm}>➕New Streak</button>
        </div>
    );
}

//the container that includes all the streaks inside
function StreaksContainer ({list, setlist}) {
    return (
        <div className="streaksContainer">
            {list.map((str) => {return Streak(str, {setlist, list})})}
        </div>
    );
}

