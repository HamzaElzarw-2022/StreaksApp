import { useState } from 'react';
import * as backEnd from "../program";
/*
*takes the list of color objects and maps it as
*a select options then returns the array of jsx options
*
*/
function renderColors(list) 
    {
        return list.map( function(color, index) {
            return <option key={index} value={index} style={{background: color.mainColor, color: color.fontColor}}>{color.color}</option>
        } );
    }

//the form that takes input from user in order to create a new streak
export default function NewStreakForm({hideForm, render}) {

    const [inputs] = useState({name:"", color:""});

    function makeNewStreak() 
    {
        if (inputs.name === "") { 
            alert("please enter Name of the streak!"); }
        else if(inputs.color === "") { 
            alert("please enter Color of the streak!"); }
        else 
        {
            backEnd.listOfStreaks.push(new backEnd.streakObject(inputs.name, inputs.color));
            render();
            hideForm();

            inputs.name = ('');
            inputs.color = ('');
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
                            <option value="" >Select your option</option>
                            {renderColors(backEnd.colors)}
                        </select>
                </label>
                <button type="button" className="formButton" onClick={makeNewStreak}>make Streak</button>
            </form>
        </div>
    );
}