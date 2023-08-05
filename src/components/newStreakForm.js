import { useState, useContext, useEffect } from 'react';
import { streaksContext } from '../contexts/streaksContext';
import axios from 'axios';
import { userContext } from '../contexts/userContext';

function useFormPosition(formVisible) {

    const [position, setPosition] = useState({})
    useEffect(()=>{
        if(window.innerWidth < 600) {
            if(formVisible) 
                setPosition({
                    top: "50%",
                    right: "50%",
                    marginRight: "-150px",
                    marginTop: "-175px",
                    transition: "top 0.5s"
                })
            else 
                setPosition({
                    top: "-200px",
                    right: "50%",
                    marginRight: "-150px",
                    marginTop: "-175px",
                    transition: "top 0.5s"
                })
        }
        else {
            if(formVisible) 
                setPosition({
                    top: "87px",
                    right: "15px",
                    marginRight: "0px",
                    marginTop: "0px",
                    transition: "right 0.5s"
                })
            else 
                setPosition({
                    top: "87px",
                    right: "-310px",
                    marginRight: "0px",
                    marginTop: "0px",
                    transition: "right 0.5s"
                })
        }

    }, [formVisible])
    return [position];
}

//the form that takes input from user in order to create a new streak
export default function NewStreakForm({formVesibility, formVisible}) {

    const { streaksDispatch } = useContext(streaksContext)
    const {user} = useContext(userContext)
    const [position] = useFormPosition(formVisible)

    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [roundUpdateTime, setRoundUpdateTime] = useState(-1);
    const [ampm, setAmpm] = useState("AM");
    
    async function makeNewStreak() 
    {
        if (name === "") {
            alert("please enter Name of the streak!"); }
        else if(color === "") {
            alert("please enter Color of the streak!"); }
        else if(roundUpdateTime === -1) {
            alert("please enter Round start time of the streak!"); }
        else 
        {
            let updateTime = roundUpdateTime;
            if(ampm === "PM") 
                updateTime = updateTime + 12
            
            try {
                const response = await axios.put(process.env.REACT_APP_PORT + '/streak/newStreaks', {
                    "name": name, 
                    "theme": color ,
                    "roundUpdateTime": updateTime
                },{
                    headers: { Authorization: `Bearer ${user.token}` }
                })
                if(response.status) 
                    streaksDispatch({
                        type: 'add',
                        streak: response.data.streak
                    })
            } catch (error) {console.log(error)} 

            formVesibility()
            setName('');
            setColor('');
            setRoundUpdateTime(-1);
            document.getElementById("nameTextBox").value = "";
            document.getElementById("updateTextBox").value = "";
            document.getElementById("colorSelector").value = "";
        }
    }

    return (
        <div className="newStreakForm" id="newStreakForm" style={position}>
            <form className="form">
                <label>
                    <span>Streak Name:</span>
                    <input type="text" className="formText" id="nameTextBox"
                        onChange={e => setName(e.target.value)}></input>
                </label>
               
                <label className="selectInput">
                    <span>round update time:</span>
                        <select name="time" className="formTime" id="updateTextBox" onChange={e => setRoundUpdateTime(parseInt(e.target.value))}>
                            <option value="-1" >Select Time</option>
                            {timeOptions()}
                        </select>
                        <select name="ampm" className="formAmPm" id="colorSelector" onChange={e => setAmpm(e.target.value)}>
                            <option value="AM" >AM</option>
                            <option value="PM" >PM</option>
                        </select>
                </label>
                <label className="selectInput">
                    <span>Streak Color:</span>
                        <select name="color" className="formText" id="colorSelector" onChange={e => setColor(e.target.value)}>
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