import { useState, useContext } from 'react';
import { streaksContext } from '../contexts/streaksContext';
import axios from 'axios';


//the form that takes input from user in order to create a new streak
export default function NewStreakForm({hideForm}) {

    const { streaksDispatch } = useContext(streaksContext)
    const [inputs] = useState({name:"", color:"", roundUpdateTime: -1, ampm:""});

    async function makeNewStreak() 
    {
        
        if (inputs.name === "") {
            alert("please enter Name of the streak!"); }
        else if(inputs.color === "") {
            alert("please enter Color of the streak!"); }
        else if(inputs.roundUpdateTime === -1) {
            alert("please enter Round start time of the streak!"); }
        else 
        {
            if(inputs.ampm === "PM")
                inputs.roundUpdateTime = inputs.roundUpdateTime + 12;
            
            try {
                const response = await axios.put(process.env.REACT_APP_PORT + '/newStreaks', {
                    "name": inputs.name, 
                    "theme": inputs.color ,
                    "roundUpdateTime": inputs.roundUpdateTime
                })
                streaksDispatch({
                    type: 'add',
                    streak: response.data
                })
            } catch (error) {console.log(error)} 

            hideForm();
            inputs.name = ('');
            inputs.color = ('');
            inputs.roundUpdateTime = ('');
            document.getElementById("nameTextBox").value = "";
            document.getElementById("updateTextBox").value = "";
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
               
                <label className="selectInput">
                    <span>round update time:</span>
                        <select name="time" className="formTime" id="updateTextBox" onChange={e => inputs.roundUpdateTime = parseInt(e.target.value)}>
                            <option value="-1" >Select Time</option>
                            {timeOptions()}
                        </select>
                        <select name="ampm" className="formAmPm" id="colorSelector" onChange={e => inputs.ampm = (e.target.value)}>
                            <option value="AM" >AM</option>
                            <option value="PM" >PM</option>
                        </select>
                </label>
                <label className="selectInput">
                    <span>Streak Color:</span>
                        <select name="color" className="formText" id="colorSelector" onChange={e => inputs.color = (e.target.value)}>
                            <option value="" >Select your option</option>
                            {colorOptions(colors)}
                        </select>
                </label>
                <button type="button" className="formButton" onClick={makeNewStreak}>make Streak</button>
            </form>
        </div>
    );
}

function colorOptions() 
{
    return colors.map( function(color, index) {
        return <option key={index} value={index} style={{background: color.mainColor, color: color.fontColor}}>{color.color}</option>
    } );
}
function timeOptions() 
{   
    const arr = [1,2,3,4,5,6,7,8,9,10,11,12]
    return arr.map( function(number) {
        return <option key={number}value={number} >{number}</option>
    } );
}

export const colors = [
    {color:"Blue", mainColor: "#91D8E4", fontColor: "#EAFDFC"},
    {color:"Green", mainColor: "#A0E4CB", fontColor: "white"},
    {color:"Gray", mainColor: "#D6E4E5", fontColor: "#497174"},
    {color:"Peach", mainColor: "#FF9F9F", fontColor: "#F2E5E5"},
    {color:"Purple", mainColor: "#DEBACE", fontColor: "#F2E5E5"},
    {color:"Yellow", mainColor: "#FFFFD0", fontColor: "#FF87B2"}
];