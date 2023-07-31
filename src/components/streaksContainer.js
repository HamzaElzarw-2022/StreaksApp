import { useContext } from "react";
import { streaksContext } from "../contexts/streaksContext";
import Streak from "./streak";


export default function StreaksContainer() {

    const {streaks} = useContext(streaksContext);

    return (
        <div className="streaksContainer">
            {streaks.map((str) => {return <Streak key={str._id} streakObject={str} />})}
            {streaks.length === 0 ? 
            <div className="noActiveStreaksMessage">
                you don't have any active streaks, 
                start a new streak by clicking on the button on the top right.
            </div> : <></>}
        </div>
    )
}