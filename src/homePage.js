import "./app.css";
import { useState, useEffect } from 'react';
import Streak from './components/streak.js';
import NotActiveStreak from './components/expiredStreak.js';
import NewStreakForm from './components/newStreakForm.js';
import axios from 'axios';
import toggleTriangle from './toggleTriangle.png';

//TODO
//fix the scroll and done button problem
//start working with DB
//add restart and delete buttons to streaks
//work on the login feature
//drag and drop

function formVisibility() {
    if (document.getElementById("newStreakForm").offsetHeight === 0) 
        document.getElementById("newStreakForm").style.height = "380px";
    
    else 
        document.getElementById("newStreakForm").style.height = "0px";
}

//main component that contain all components
export default function HomePage() {

    const [notActiveStreaks, setNotActiveStreaks] = useState([]);
    const [streaksList, setStreaksList] = useState([]);
    const [initialized, setInitialized] = useState(true);

    function getstreaks() 
    {
        
        setInitialized(true);
        axios.get('http://localhost:8080/getStreaks'
        ).then(function(response) {

            console.log(response);
            response.data.map((streak) => {
                if(streak.active === true) 
                    setStreaksList(prevStreaksList => [...prevStreaksList, streak]);
                else 
                    setNotActiveStreaks(prevNotActiveStreaks => [...prevNotActiveStreaks, streak]);
                return streak;
            })
            
        }).catch((error) => {
            setInitialized(false);
            console.log(initialized)
        });
    }
    useEffect(()=>{
        getstreaks();
    }, []);
    
    return (
        <div>
            <TitleBar showForm={formVisibility}/>
            <NewStreakForm hideForm={formVisibility} list={streaksList} setlist={setStreaksList}/>
            {!initialized ? <FailedToLoad reload={getstreaks}/> : 
                <StreaksContainer streaksList={streaksList} setStreaksList={setStreaksList} setNotActiveStreaks={setNotActiveStreaks} notActiveStreaks={notActiveStreaks}/>}
        </div>
    );
}
//component appear if couldn't load old streaks from server
function FailedToLoad({reload}) {
    return(
        <div className="failedContainer">
            <div className="failedToLoad">
                Failed to connect to server !! 
                <button className="reloadStreakbtn" onClick={reload}> try again</button>
            </div> 
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
function StreaksContainer ({streaksList, setStreaksList, setNotActiveStreaks, notActiveStreaks}) {
    
    function extendExpiredSection() {
        const expiredContainer = document.getElementById("expiredContainer");
        if(expiredContainer.offsetHeight !== 0) {
            expiredContainer.style.height = "0px"; 
            document.getElementById("toggleTriangle").style.transform = "rotate(0deg)"
        }
        else {
            expiredContainer.style.height = (60 * expiredContainer.childElementCount) + 10 + "px";
            document.getElementById("toggleTriangle").style.transform = "rotate(90deg)"

        }
    }
    
    return (
        <div className="content">
            <div className="streaksContainer">
                {streaksList.map((str) => {return <Streak key={str._id} streakObject={str} setlist={setStreaksList} list={streaksList} setNotActiveStreaks={setNotActiveStreaks}/>})}
                {streaksList.length === 0 ? 
                <div className="noActiveStreaksMessage">
                    you don't have any active streaks yet, 
                    start your first streak from the button on the top right.
                </div> : <></>}
            </div>
            <div className="expiredSection" id="expiredSection">
                <div className="expiredLabel" onClick={extendExpiredSection}>
                    <img src={toggleTriangle} className="toggleTriangle" alt="toggleTriangle" id="toggleTriangle"/>
                    expired Streaks: 
                </div>
                <div className="expiredStreaksContainer" id="expiredContainer">
                    {notActiveStreaks.length === 0 ? <div className="noExpiredStreaksMessage">you don't have any expired streaks 💪</div> : <></>}
                    {notActiveStreaks.map((str) => {return <NotActiveStreak key={str._id} streakObject={str} setStreaksList={setStreaksList} setNotActiveStreaks={setNotActiveStreaks}/>})}
                </div>
            </div>
            
        </div>
    );
}


