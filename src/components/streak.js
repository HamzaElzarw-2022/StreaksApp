import * as backEnd from "../program";


//each block of streak
let extendedStreak = "0";
const delay = ms => new Promise(res => setTimeout(res, ms));

async function extendStreak(e) 
{
    if(e.target.tagName !== "BUTTON") {
        if(e.target.offsetHeight !== 500 ) 
        {
            
            document.getElementById(extendedStreak).style.height = "100px";
            document.getElementById(extendedStreak).firstChild.style.height = "100px";
            e.target.style.height = "500px";
            extendedStreak = e.target.id;
            e.target.firstChild.style.height = "0px";
            await delay(400);
            console.log(e.target.getBoundingClientRect());
            console.log(e.target.offsetTop);
            window.scrollTo(0,e.target.offsetTop - 72 - 85);
        }
        else 
        {
           e.target.style.height = "100px";
           e.target.firstChild.style.height = "100px";
        }
    }
}



export default function Streak(name, colorIndex, count, index, rendercounter) 
{   
    const colorPalette = backEnd.colors[colorIndex]
    function handleClick() {
        backEnd.listOfStreaks[index].incrementCount();
        console.log("increment was clicked");
        console.log(index);
        rendercounter();
    }
    
    return (
        <div 
            key={index} id={index} className="streakDiv" 
            style={{background: colorPalette.mainColor, color: colorPalette.fontColor}} 
            onClick={e => extendStreak(e)}>
            <div className="collapsedStreak streakElements" id="collapsedData">
                <p className="streakCount streakElements" >{count}<span className="sub">days</span></p>
                <p className="streakName streakElements">{name}</p>
                <p className="streakState streakElements">next click in 24h</p>
            </div>

            <div className="extendedStreak  streakElements" id="extendedData">
                <p className="streakElements exStreakName">{name}</p>
                <p className="streakElements exStreakCount" >{count}<span className="exsub">days</span></p>
                <button className="incrementButton" type="button"  onClick={handleClick}
                    style={{background: colorPalette.fontColor, color: colorPalette.mainColor}}>Done</button>
                <p className="streakElements exStreakState">next click in 24h</p>
            </div>
        </div>
    )
}