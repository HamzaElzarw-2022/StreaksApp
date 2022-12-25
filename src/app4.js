import "./app4.css";
import { useState } from 'react';
import "./program";

class streakObject {

    constructor(name, color) {
        this.name= name;
        this.color= color;
        this.count= 0;
    }

    incrementCount() {
        this.count++;
        console.log(this.count);
    }

}

let listOfStreaks = [];

//TODO
//add the logo
//desing the newStreakButton for better style
//styling when width is less than 500px (smart phones)
//figure out all properties of a streak and add to the newStreakForm
//figure out how to add streaks using form and keep tracking using state
//next phase:
//the streak should grow dinamically on click and have the increment button, description, animation utility, and more
//next,

//main component that contain all components

export default function App4() {

    const [streaksList, setStreaksList] = useState([]);
    console.log("i was here");
    function renderContainer() 
    {
        function mapping(e, index) {
            return Streak(e.name, e.color, e.count, index, renderContainer);
        }
        setStreaksList(listOfStreaks.map(mapping));
    }
    
    function formVisibility() 
    {
        if (document.getElementById("newStreakForm").offsetHeight === 0) {
            document.getElementById("newStreakForm").style.height = "300px";
        }
        else {
            document.getElementById("newStreakForm").style.height = "0px";
        }
    }

    return (
        <>
            <TitleBar showForm={formVisibility}/>
            <NewStreakForm render={renderContainer} hideForm={formVisibility}/>
            <StreaksContainer list={streaksList} />
        </>
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

//the form that takes input from user in order to create a new streak
function NewStreakForm({hideForm, render}) {

    const [inputs] = useState({name:"", color:""});

    function buttonClick() 
    {
        if (inputs.name === "") { 
            alert("please enter Name of the streak!"); }
        else if(inputs.color === "") { 
            alert("please enter Color of the streak!"); }
        else 
        {
            listOfStreaks.push(new streakObject(inputs.name, inputs.color));
            render();
            hideForm();

            inputs.name = ('');
            document.getElementById("nameTextBox").value = "";
            document.getElementById("colorSelector").value = "";
        }
      }

    return (
        
        <div className="newStreakForm" id="newStreakForm" >
            <form className="form">
                <label>
                    <span>Streak Name:</span>
                    <input type="text" className="formText" id="nameTextBox"
                        onChange={e => inputs.name = (e.target.value)}></input>
                </label>
                <label className="selectColor">
                    <span>Streak Color:</span>
                        <select name="color" className="formText" id="colorSelector" onChange={e => inputs.color = (e.target.value)}>
                            <option value="" disabled selected>Select your option</option>
                            <option value="#91D8E4">Blue</option>
                            <option value="#A0E4CB">green</option>
                            <option value="#D6E4E5">gray</option>
                            <option value="#FF9F9F">peach</option>
                        </select>
                </label>
                <button type="button" className="formButton" onClick={buttonClick}>make Streak</button>
            </form>
        </div>
    );
}
//the container that contains all the streaks inside
function StreaksContainer ({list}) {
    return (
        <div className="streaksContainer">
            {list}
        </div>
    );
}
//each block of streak
let extendedStreak = "0";
//let isExtended = false;
function extendStreak(e) 
{
    if(e.target.tagName !== "BUTTON") {
        if(e.target.offsetHeight !== 500 ) 
        {
         //if(isExtended)
              document.getElementById(extendedStreak).style.height = "100px";
              document.getElementById(extendedStreak).firstChild.style.height = "100px";
          e.target.style.height = "500px";
          extendedStreak = e.target.id;
          e.target.firstChild.style.height = "0px";
         // isExtended= true;
        
        }
        else {
           // isExtended=false;
           e.target.style.height = "100px";
           e.target.firstChild.style.height = "100px";
        
        }
    }
    
}
function Streak(name, color, count, index, rendercounter) 
{   
    let indexr = index;

    function handleClick() {
        listOfStreaks[indexr].incrementCount();
        console.log("increment was clicked");
        console.log(indexr);
        rendercounter();
    }

    return (
        <div key={index} id={index} className="streakDiv" style={{background: color}} 
        onClick={e => extendStreak(e)}>
            <div className="collapsedStreak streakElements" id="collapsedData">
                <p className="streakCount streakElements" >{count}<span className="sub">days</span></p>
                <p className="streakTitle streakElements">{name}</p>
                <p className="streakState streakElements">next click in 24h</p>
            </div>

            <div className="extendedStreak  streakElements" id="extendedData">
                <p className="streakElements exStreakName">{name}</p>
                <p className="streakElements exStreakCount" >{count}<span className="sub">days</span></p>
                <button className="incrementButton" type="button" onClick={handleClick}>Done</button>
                <p className="streakElements exStreakState">next click in 24h</p>
            </div>
        </div>
    )
}