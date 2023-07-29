import "../styles/login.css"

export default function Login() {

    return(
        <div>
            <div className="head">🔥Streaks</div>
            <div className="loginForm">
                
                <label className="label">Email address</label>
                <input className="formElement inputs" spellcheck="false"></input>
                <div className="label">Password</div>
                <input type="password" className="formElement inputs" spellcheck="false"></input>
                <button className="formElement loginButton">Log in</button>
                <div className="remember"><input type="checkBox" className="checkbox"/> remember me</div>
                <div className="divider"></div>
                <div className="createAccount">first streak? <a href="">create account</a></div>
            </div>
        </div>
    );
}