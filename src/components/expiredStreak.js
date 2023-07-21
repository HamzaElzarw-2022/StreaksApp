import { useState} from 'react';
import axios from 'axios';
import retryIcon from '../retry.png'
import deleteIcon from '../delete.png'

export default function NotActiveStreak({streakObject, setStreaksList, setNotActiveStreaks}) 
{
    const [isHover, setIsHover] = useState(false);
    
    function deleteExpiredStreak() {
        if (window.confirm(`are you sure you want to delete "${streakObject.name}" streak ?`)) {

            axios.put('http://localhost:8080/deleteStreak',
                {"id": streakObject.id}
            ).then((res) => {
                if(res.data.status === true) {
                    setNotActiveStreaks( NotActiveStreaks => NotActiveStreaks.filter((streak)=> {
                        if(streakObject.id === streak.id)
                            return false;
                        return true
                    }))
                }
            }).catch((error) => {alert(error.message)});

        }
    }
    function retryExpiredStreak() {

        axios.put('http://localhost:8080/retryStreak',
            {"id": streakObject.id}
        ).then((res) => {
            if(res.data.status === true) {
                setStreaksList( activeStreaks => [...activeStreaks, res.data.streak])

                setNotActiveStreaks( NotActiveStreaks => NotActiveStreaks.filter((streak)=> {
                    if(streakObject.id === streak.id)
                        return false;
                    return true
                }))
            }
        }).catch((error) => {alert(error.message)});

        alert("retry was pressed")
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