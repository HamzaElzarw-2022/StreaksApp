
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/homePage.css";
import hamburgerMune from "../icons/HamburgerMenu.svg"

import StreaksContainer from '../components/streaksContainer';
import ExpiredContainer from '../components/expiredContainer';
import NewStreakForm from '../components/newStreakForm.js';
import { userContext } from '../contexts/userContext';
import { StreaksProvider, streaksContext } from '../contexts/streaksContext.js';


function formVisibility() {
    if (document.getElementById("newStreakForm").offsetHeight === 0) 
        document.getElementById("newStreakForm").style.height = "340px";
    
    else 
        document.getElementById("newStreakForm").style.height = "0px";
}

//main component that contain all components
export default function HomePage() {

    const {user} = useContext(userContext);

    const navigate = useNavigate()
    useEffect(()=> {
        if(!user)
            navigate("/login")
    }, [user])

    
    return (
        <div>
            <TitleBar showForm={formVisibility}/>
            <StreaksProvider>
                <NewStreakForm hideForm={formVisibility}/>
                <Content />
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
            <img className="hamburgerMenu" src={hamburgerMune} alt="menu" />
            <div className="logo">🔥Streaks</div> 
            <button className="newStreakButton" type="button" onClick={showForm}>➕New Streak</button>
        </div>
    );
}
//the container that includes all the streaks inside
function Content () {

    const {streaksDispatch, expiredDispatch} = useContext(streaksContext);
    const [initialized, setInitialized] = useState(false);
    const {user} = useContext(userContext)

    const getstreaks = async () => {
        try {
            if(!initialized) {
                const response = await axios.get(process.env.REACT_APP_PORT + '/streak/getStreaks',{
                    headers: { Authorization: `Bearer ${user.token}` }
                })
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
    
    return (
        <>
        <div className="content">{!initialized ? 
            <FailedToLoad reload={getstreaks}/> : 
                <><StreaksContainer />
                <ExpiredContainer /></>
                
            
        }</div>
        </>
        
    );
}


