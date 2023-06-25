import "./app.css";
import { useState } from 'react';
import Streak from './components/streak.js';
import NewStreakForm from './components/newStreakForm.js'

//TODO
//link font color in the list with element
//fix the scroll and form problem
//read and write data
//start the time 
//drag and drop

//changes after last commit:
//removed list of streaks
//usestate containes data which is mapped in the container

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
    
    const [streaksList2, setStreaksList2] = useState([]);

    return (
        <>
            <TitleBar showForm={formVisibility}/>
            <NewStreakForm hideForm={formVisibility} list={streaksList2} setlist={setStreaksList2}/>
            <StreaksContainer list={streaksList2} setlist={setStreaksList2}/>
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
function StreaksContainer ({list, setlist}) {
    return (
        <div className="streaksContainer">
            {list.map((str) => {return Streak(str.name, str.color, str.count, str.index, {setlist, list})})}
        </div>
    );
}

