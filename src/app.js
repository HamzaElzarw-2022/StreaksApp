import "./app.css";
import { useState } from 'react';
import "./program";

//TODO
//link font color in the list with element
//fix the scroll and form problem

//changes after last commit
//scroll to streak when it extend

class streakObject 
{
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
let listOfStreaks = [
    new streakObject("The Streak", "#91D8E4"),
    new streakObject("The Streak", "#A0E4CB"),
    new streakObject("The Streak", "#D6E4E5"),
    new streakObject("The Streak", "#FF9F9F")
];

let colors = [
    {value: "#91D8E4", color:"Blue", fontColor: "white"},
    {value: "#A0E4CB", color:"Green", fontColor: "white"},
    {value: "#D6E4E5", color:"Gray", fontColor: "white"},
    {value: "#FF9F9F", color:"Peach", fontColor: "white"},
]

const delay = ms => new Promise(res => setTimeout(res, ms));

//main component that contain all components
export default function App() {

    const [streaksList, setStreaksList] = useState(listOfStreaks.map(mapping));

    function mapping(e, index) {
        return Streak(e.name, e.color, e.count, index, renderContainer);
    }
    function renderContainer() {
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
            inputs.color = ('');
            document.getElementById("nameTextBox").value = "";
            document.getElementById("colorSelector").value = "";
        }
      }

      function RenderColors(list) 
      {
        return list.map( function(color) {
            return <option value={color.value} style={{background: color.value, color: color.fontColor}}>{color.color}</option>
        } );
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
                            <option value="" >Select your option</option>
                            {RenderColors(colors)}
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
                <p className="streakName streakElements">{name}</p>
                <p className="streakState streakElements">next click in 24h</p>
            </div>

            <div className="extendedStreak  streakElements" id="extendedData">
                <p className="streakElements exStreakName">{name}</p>
                <p className="streakElements exStreakCount" >{count}<span className="exsub">days</span></p>
                <button className="incrementButton" type="button" style={{color: color}} onClick={handleClick}>Done</button>
                <p className="streakElements exStreakState">next click in 24h</p>
            </div>
        </div>
    )
}