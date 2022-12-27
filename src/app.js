import "./app.css";
import { useState } from 'react';
import * as backEnd from "./program";
import Streak from './components/streak.js';
import NewStreakForm from './components/newStreakForm.js'

//TODO
//link font color in the list with element
//fix the scroll and form problem
//read and write data
//start the time 

//changes after last commit
//

function formVisibility() 
    {
        if (document.getElementById("newStreakForm").offsetHeight === 0) {
            document.getElementById("newStreakForm").style.height = "300px";
        }
        else {
            document.getElementById("newStreakForm").style.height = "0px";
        }
    }
//main component that contain all components
export default function App() {

    function mapping(e, index) {
        return Streak(e.name, e.color, e.count, index, renderContainer);
    }

    const [streaksList, setStreaksList] = useState(backEnd.listOfStreaks.map(mapping));

    function renderContainer() {
        setStreaksList(backEnd.listOfStreaks.map(mapping));
    }
    
    return (
        <>
            <TitleBar showForm={formVisibility}/>
            <NewStreakForm render={renderContainer} hideForm={formVisibility}/>
            <StreaksContainer list={streaksList} />
        </>
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
//the container that contains all the streaks inside
function StreaksContainer ({list}) {
    return (
        <div className="streaksContainer">
            {list}
        </div>
    );
}

