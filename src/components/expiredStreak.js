import { useContext, useState} from 'react';
import axios from 'axios';
import retryIcon from '../icons/retry.png'
import deleteIcon from '../icons/delete.png'
import { streaksContext } from '../contexts/streaksContext';

export default function NotActiveStreak({streakObject}) 
{
    const {streaksDispatch, expiredDispatch} = useContext(streaksContext)
    const [isHover, setIsHover] = useState(false);
    
    const deleteExpiredStreak = async() => {
        if (window.confirm(`are you sure you want to delete "${streakObject.name}" streak ?`)) {
            const response = await axios.put(process.env.REACT_APP_PORT + '/streak/deleteStreak', {"id": streakObject._id} )
            if(response.data.status === true) 
                expiredDispatch({
                    type: 'remove',
                    _id: streakObject._id
                })
            else
                alert(response.data.message)
        }
    }
    const retryExpiredStreak = async() => {
        const response = await axios.put(process.env.REACT_APP_PORT + '/streak/retryStreak', {"id": streakObject._id} )
        if(response.data.status) {
            streaksDispatch({
                type: 'add',
                streak: response.data.streak
            })
            expiredDispatch({
                type: 'remove',
                _id: streakObject._id
            })
            alert(`"${response.data.streak.name}" streak was moved to active streaks`)
        }
        else
            alert(response.data.message);
    }

    return(
        <div className="notActiveStreak" onMouseLeave={() => {setIsHover(false)}} onMouseEnter={() => {setIsHover(true)}}>
            <p className="notActiveName" >{streakObject.name}</p>
            <p className="notActiveCounter"> highest streak: {streakObject.highestStreak} </p>
            <p className="notActiveAttemts"> attempts: {streakObject.numberOfAttempts} </p>

            <div className="expiredOptionsDiv" style={{visibility: isHover ? 'visible' : 'hidden' }}>
                <img src={retryIcon} onClick={retryExpiredStreak} className="retryIcon scaleBig" alt="retryIcon" id="retryIcon"/>
                <img src={deleteIcon} onClick={deleteExpiredStreak} className="deleteIcon scaleBig" alt="deleteIcon" id="deleteIcon"/>
            </div>
        </div>
    );
}