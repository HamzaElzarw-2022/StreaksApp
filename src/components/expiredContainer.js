import toggleTriangle from '../icons/toggleTriangle.png'
import { useContext } from 'react';
import { streaksContext } from '../contexts/streaksContext';
import NotActiveStreak from './expiredStreak';

export default function ExpiredContainer() {

    const {expiredStreaks} = useContext(streaksContext);

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

    return(
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
    )
}