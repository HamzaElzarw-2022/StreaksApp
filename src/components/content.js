import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import StreaksContainer from '../components/streaksContainer';
import ExpiredContainer from '../components/expiredContainer';
import { userContext } from '../contexts/userContext';
import { streaksContext } from '../contexts/streaksContext.js';
import loadingIcon from '../icons/loadingIcon.png'
import useLogout from '../hooks/useLogout';

export default function Content() {

    const {streaksDispatch, expiredDispatch} = useContext(streaksContext);
    const {user} = useContext(userContext);
    const [status, setStatus] = useState("");
    const [content, setContent] = useState(<Loading />);
    const {logout} = useLogout();

    useEffect(()=> {
        switch(status) {
            case "loading": {
                setContent(<Loading />)
                break;
            }
            case "success": {
                setContent(<><StreaksContainer /><ExpiredContainer /></>)
                break;
            }
            case "failure": {
                setContent(<FailedToLoad reload={getstreaks}/>)
                break;
            }
            default: {}
        }
    }, [status])

    const getstreaks = async () => {
        
        try {
            if(status !== "loading") {
                setStatus("loading")
                const response = await axios.get(process.env.REACT_APP_PORT + '/streak/getStreaks',{
                    headers: { Authorization: `Bearer ${user.token}` }
                })
                if(response.status) {
                    response.data.map((streak) => {
                    if(streak.active === true) 
                        streaksDispatch({ type: 'add', streak: streak })
                    else 
                        expiredDispatch({ type: 'add', streak: streak })
                    return streak;
                    })
                    setStatus("success")
                }
                else {
                    logout()
                }
                
            }
        } catch { 
            setStatus("failure") 
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(()=>{ getstreaks() },[]);
    
    return (
        <div className="content">
            {content}
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
function Loading() {
    return(
        <div className="contentLoading">
            <img className="loadingIcon rotate" src={loadingIcon} alt="loadingIcon" />
        </div>
    )
}