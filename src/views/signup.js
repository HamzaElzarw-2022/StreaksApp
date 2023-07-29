import { useState } from "react";
import "../styles/login.css"
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
    
    const [email, setEmail] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [password, setPassword] = useState("");
    const [repPassword, setRepPassword] = useState("");
    const [message, setMessage] = useState("")
    const navigate = useNavigate();

    const signup = async() => {
        setMessage("")
        try {
            if(password === repPassword) {
                const response = await axios.post(process.env.REACT_APP_PORT + '/user/signup',{
                password: password, 
                email: email,
                lname: lname,
                fname: fname,
                })
                if(response.data.status) {
                    setMessage("")
                    console.log(response.data)
                    navigate("/homepage")
                }
                else 
                    setMessage(response.data.message)
                
                    
            }
            else {
                setMessage("two passwords does not match")
            }
            
        } catch (error) {
            console.log(error)
            alert("an error has occured while singing up")
        }
        
    }

    

    return(
        <div>
            <div className="head">🔥Streaks</div>
            <div className="loginForm">
                <div className="formElement">Create Account</div>
                <input className="formElement inputs name fname" spellCheck="false" onChange={e => setFname(e.target.value)} placeholder="First name"></input>
                <input className="formElement inputs name" spellCheck="false" onChange={e => setLname(e.target.value)} placeholder="Last name"></input>

                <input className="formElement inputs" spellCheck="false" onChange={e => setEmail(e.target.value)} placeholder="Email address"></input>
                
                <div className="logindivider"></div>
                
                <input type="password" className="formElement inputs password" spellCheck="false" onChange={e => setPassword(e.target.value)} placeholder="new password"></input>
                <input type="password" className="formElement inputs" spellCheck="false" onChange={e => setRepPassword(e.target.value)} placeholder="repeat password"></input>
                
                
                <button className="formElement loginButton" onClick={signup} >sign up</button>
                <div className="message">{message}</div>

                <div className="remember"><input type="checkBox" className="checkbox"/> remember me</div>
                <div className="createAccount">already have an account? <Link to="/">log in</Link></div>
            </div>
        </div>
    );
}