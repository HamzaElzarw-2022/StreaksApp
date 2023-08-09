import { useState, useContext } from 'react';
import { streaksContext } from '../contexts/streaksContext';
import axios from 'axios';
import { userContext } from '../contexts/userContext';
import useFormPosition from '../hooks/useFormPosition';
import loadingIcon from '../icons/loadingIcon.png'

//the form that takes input from user in order to create a new streak
export default function NewStreakForm({formVesibility, formVisible}) {

    const { streaksDispatch } = useContext(streaksContext)
    const {user} = useContext(userContext)
    const {position} = useFormPosition(formVisible)
    const [loading, setLoading] = useState(false)

    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [roundUpdateTime, setRoundUpdateTime] = useState(-1);
    const [ampm, setAmpm] = useState("AM");
    
    async function makeNewStreak(e) 
    {
        e.preventDefault()
        setLoading(true)
        if (name === "") {
            alert("please enter Name of the streak!"); }
        else if(color === "") {
            alert("please enter Color of the streak!"); }
        else if(roundUpdateTime === -1) {
            alert("please enter Round start time of the streak!"); }
        else 
        {
            let updateTime = roundUpdateTime;
            console.log(updateTime)
            if(ampm === "PM") 
                updateTime = updateTime + 12
            
            const day = new Date().getHours() >= updateTime ? new Date().getDate()+1 : new Date().getDate();
            const roundEnd = new Date(new Date().getFullYear(), new Date().getMonth(), day, updateTime)
            
            try {
                const response = await axios.put(process.env.REACT_APP_PORT + '/streak/newStreaks', {
                    "name": name, 
                    "theme": color,
                    "roundEnd": roundEnd
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
            setRoundUpdateTime(-1);
            document.getElementById("nameTextBox").value = "";
            document.getElementById("updateTextBox").value = "";
        }
        setLoading(false)
    }

    return (
        <div className="newStreakForm" id="newStreakForm" style={position}>
            <form className="form" onSubmit={(e) => makeNewStreak(e)}>
                <label>
                    <span>Streak Name:</span>
                    <input type="text" className="formText" id="nameTextBox"
                        onChange={e => setName(e.target.value)}></input>
                </label>
               
                <label className="selectInput">
                    <span>round update time:</span>
                    <input name="time" type='number' className='formTime' id="updateTextBox" placeholder='select time' min='1' max='12' onChange={e => setRoundUpdateTime(parseInt(e.target.value))}/>
                    <select name="ampm" className="formAmPm" id="colorSelector" onChange={e => setAmpm(e.target.value)}>
                        <option value="AM" >AM</option>
                        <option value="PM" >PM</option>
                    </select>
                </label>
                <label className="selectInput">
                    <span>Streak Color:</span>
                    <select name="color" className="formText" id="colorSelector" onChange={e => setColor(e.target.value)}>
                        <option value="" defaultChecked >Select your option</option>
                        {colorOptions(colors)}
                    </select>
                </label>
                <button type="submit" className="formButton" disabled={loading} >
                    {loading ? <img className="loadingIconNewStreak rotate" src={loadingIcon} alt="loadingIcon" /> : <>make Streak</>}
                </button>
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
export const colors = [
    {color:"Blue", mainColor: "#91D8E4", fontColor: "#EAFDFC"},
    {color:"Green", mainColor: "#A0E4CB", fontColor: "white"},
    {color:"Gray", mainColor: "#D6E4E5", fontColor: "#497174"},
    {color:"Peach", mainColor: "#FF9F9F", fontColor: "#F2E5E5"},
    {color:"Purple", mainColor: "#DEBACE", fontColor: "#F2E5E5"},
    {color:"Yellow", mainColor: "#FFFFD0", fontColor: "#FF87B2"}
];