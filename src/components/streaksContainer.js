import { useContext, useState } from "react";
import { streaksContext } from "../contexts/streaksContext";
import Streak from "./streak";

const delay = ms => new Promise(res => setTimeout(res, ms));

export default function StreaksContainer() {

    const {streaks} = useContext(streaksContext);
    const [extendedNow, setExtendedNow] = useState(null);

    const extendStreak = async (e, setHeight, setCollapsedHeight) => {
        if(e.target.tagName !== "BUTTON") {
            if(e.target.offsetHeight < 400 ) {
                collapseStreak();
                setHeight(window.innerWidth<600 ? "400px" : "520px")
                setExtendedNow({setHeight, setCollapsedHeight});
                setCollapsedHeight("0px")
                await delay(400);
                window.scrollTo(0,e.target.offsetTop - 72 - 85);
            }
            else 
                collapseStreak();
        }
    }
    const collapseStreak = () => {
        if(extendedNow) {
            const height = window.innerWidth < 600 ? "70px" : "100px";
            extendedNow.setHeight(height)
            extendedNow.setCollapsedHeight(height)
            setExtendedNow(null);
        }
    }

    return (
        <div className="streaksContainer">
            {streaks.map((str) => {return <Streak key={str._id} streakObject={str} extendStreak={extendStreak}/>})}
            {streaks.length === 0 ? 
            <div className="noActiveStreaksMessage">
                you don't have any active streaks, 
                start a new streak by clicking on the button on the top right.
            </div> : <></>}
        </div>
    )
}