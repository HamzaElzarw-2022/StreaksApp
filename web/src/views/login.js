import { useContext, useEffect, useState } from "react";
import "../styles/login.css"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../contexts/userContext";
import fireIcon from "../icons/fire.png"
import loadingIcon from '../icons/loadingIcon.png'

export default function Login() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const {user, userDispatch} = useContext(userContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    useEffect(()=> {
        if(user)
            navigate("/homepage")

    }, [user])
    

    const login = async() => {
        
        setMessage("")
        setLoading(true)
        try {
            const response = await axios.post(process.env.REACT_APP_PORT + '/user/login',{
                password: password, 
                email: email
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
            
        } catch (error) {
            console.log(error)
            alert("an error has occured while logging in")
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
                
                <label className="label">Email address</label>
                <input className="formElement inputs" spellCheck="false" onChange={e => setEmail(e.target.value)}></input>
                <div className="label">Password</div>
                <input type="password" className="formElement inputs" spellCheck="false" onChange={e => setPassword(e.target.value)}></input>
                <button className="formElement loginButton" onClick={login} disabled={loading}>
                    {loading ? <img className="loadingIconLogin rotate" src={loadingIcon} alt="loadingIcon" /> : <>Log in</>}
                </button>
                <div className="message">{message}</div>
                <div className="remember"><input type="checkBox" className="checkbox"/> remember me</div>
                <div className="createAccount">first streak? <Link to="/signup">create account</Link></div>
            </div>
        </div>
    );
}