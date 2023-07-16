import { useState } from 'react';
import {colors} from "../objects";
import axios from 'axios';

/*
*takes the list of color objects and maps it as
*a select options then returns the array of jsx options
*
*/
function renderColors(colorList) 
{
    return colorList.map( function(color, index) {
        return <option key={index} value={index} style={{background: color.mainColor, color: color.fontColor}}>{color.color}</option>
    } );
}

//the form that takes input from user in order to create a new streak
export default function NewStreakForm({hideForm, list, setlist}) {

    const [inputs] = useState({name:"", color:"", roundUpdateTime: -1, ampm:""});

    function makeNewStreak() 
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

            axios.put('http://localhost:8080/newStreaks', {
                "name": inputs.name, 
                "theme": inputs.color ,
                "roundUpdateTime": inputs.roundUpdateTime
            }).then((res) => {
                console.log(res.data)
                setlist([...list, res.data])
            }).catch((error) => {alert(error)});

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
                            <option value="1" >1</option>
                            <option value="2" >2</option>
                            <option value="3" >3</option>
                            <option value="4" >4</option>
                            <option value="5" >5</option>
                            <option value="6" >6</option>
                            <option value="7" >7</option>
                            <option value="8" >8</option>
                            <option value="9" >9</option>
                            <option value="10" >10</option>
                            <option value="11" >11</option>
                            <option value="12" >12</option>
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
                            {renderColors(colors)}
                        </select>
                </label>
                <button type="button" className="formButton" onClick={makeNewStreak}>make Streak</button>
            </form>
        </div>
    );
}