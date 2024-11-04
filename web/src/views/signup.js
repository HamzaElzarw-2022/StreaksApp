import { useState, useContext, useEffect } from "react";
import "../styles/login.css"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { userContext  } from "../contexts/userContext";
import fireIcon from "../icons/fire.png"
import loadingIcon from '../icons/loadingIcon.png'


export default function Signup() {
    
    const [email, setEmail] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [password, setPassword] = useState("");
    const [repPassword, setRepPassword] = useState("");

    const [message, setMessage] = useState("")
    const {user, userDispatch } = useContext(userContext);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate()
    useEffect(()=> {
        if(user)
            navigate("/homepage")

    }, [user])

    const signup = async() => {
        setLoading(true)
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
                    userDispatch({
                        type: "login",
                        user: response.data
                    })
                    localStorage.setItem("user", JSON.stringify(response.data))
                    
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
        setLoading(false)
    }

    

    return(
        <div>
            <div className="head">
                <img className="loginLogo" src={fireIcon} alt="logo" />
                <span>Streaks</span>
            </div>
            <div className="loginForm">
                <div className="formElement">Create Account</div>
                <input className="formElement inputs name fname" spellCheck="false" onChange={e => setFname(e.target.value)} placeholder="First name"></input>
                <input className="formElement inputs name" spellCheck="false" onChange={e => setLname(e.target.value)} placeholder="Last name"></input>

                <input className="formElement inputs" spellCheck="false" onChange={e => setEmail(e.target.value)} placeholder="Email address"></input>
                
                <div className="logindivider"></div>
                
                <input type="password" className="formElement inputs password" spellCheck="false" onChange={e => setPassword(e.target.value)} placeholder="new password"></input>
                <input type="password" className="formElement inputs" spellCheck="false" onChange={e => setRepPassword(e.target.value)} placeholder="repeat password"></input>
                
                
                <button className="formElement loginButton" onClick={signup} disabled={loading}>
                    {loading ? <img className="loadingIconLogin rotate" src={loadingIcon} alt="loadingIcon" /> : <>sign up</>}
                </button>
                <div className="message">{message}</div>

                <div className="remember"><input type="checkBox" className="checkbox"/> remember me</div>
                <div className="createAccount">already have an account? <Link to="/">log in</Link></div>
            </div>
        </div>
    );
}