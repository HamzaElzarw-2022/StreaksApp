
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import "../styles/homePage.css";

import Streak from '../components/streak.js';
import NotActiveStreak from '../components/expiredStreak.js';
import toggleTriangle from '../icons/toggleTriangle.png';
import NewStreakForm from '../components/newStreakForm.js';
import { StreaksProvider, streaksContext } from '../contexts/streaksContext.js';
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
    
    return (
        <div>
            <TitleBar showForm={formVisibility}/>
            <StreaksProvider>
                <NewStreakForm hideForm={formVisibility}/>
                <StreaksContainer/>
            </StreaksProvider>
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
            <span className="title">🔥Streaks</span> 
            <button className="newStreakButton" type="button" onClick={showForm}>➕New Streak</button>
        </div>
    );
}
//the container that includes all the streaks inside
function StreaksContainer () {

    const {streaksDispatch, expiredDispatch, streaks, expiredStreaks} = useContext(streaksContext);
    const [initialized, setInitialized] = useState(false);

    const getstreaks = async () => {
        try {
            if(!initialized) {
                const response = await axios.get(process.env.REACT_APP_PORT + '/streak/getStreaks')
                console.log(response);

                response.data.map((streak) => {
                    if(streak.active === true) 
                        streaksDispatch({ type: 'add', streak: streak })
                    else 
                        expiredDispatch({ type: 'add', streak: streak })
                    return streak;
                })
                setInitialized(true);
            }
        } catch { setInitialized(false) }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(()=>{ getstreaks() },[]);

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
        <>
        {!initialized ? <FailedToLoad reload={getstreaks}/> : 
        <div className="content">
            <div className="streaksContainer">
                {streaks.map((str) => {return <Streak key={str._id} streakObject={str} />})}
                {streaks.length === 0 ? 
                <div className="noActiveStreaksMessage">
                    you don't have any active streaks, 
                    start a new streak by clicking on the button on the top right.
                </div> : <></>}
            </div>
            <div className="expiredSection" id="expiredSection">
                <div className="expiredLabel" onClick={extendExpiredSection}>
                    <img src={toggleTriangle} className="toggleTriangle" alt="toggleTriangle" id="toggleTriangle"/>
                    expired Streaks: 
                </div>
                <div className="expiredStreaksContainer" id="expiredContainer">
                    {expiredStreaks.map((str) => {return <NotActiveStreak key={str._id} streakObject={str} />})}
                    {expiredStreaks.length === 0 ? <div className="noExpiredStreaksMessage">you don't have any expired streaks 💪</div> : <></>}
                </div>
            </div>
        </div>}
        </>
        
    );
}


