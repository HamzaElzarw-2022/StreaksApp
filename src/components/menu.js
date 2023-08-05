import { useContext} from "react"
import { userContext } from "../contexts/userContext"
import "../styles/switch.css";
import { streaksContext } from "../contexts/streaksContext";

export default function Menu({menuVisible}) {

    const {user, userDispatch} = useContext(userContext)
    const {streaksDispatch, expiredDispatch} = useContext(streaksContext);

    function logout() {

        localStorage.removeItem('user')
        userDispatch({
            type: "logout"
        })
        streaksDispatch({
            type: "logout"
        })
        expiredDispatch({
            type: "logout"
        })
        // navigate("/login")
    }
    
    return(
        <div className="menu" style={menuVisible ? {left:"15px"} : {left:"-300px"}}>
            <div className="menuElement email">{user ? user.email : " "}</div>
            <div className="menudivider"></div>
            {/* <div class="switch">
	            <input id="language-toggle" class="check-toggle check-toggle-round-flat" type="checkbox" />
	            <label for="language-toggle"></label>
	            <span class="on">English</span>
	            <span class="off">Arabic</span>
  	        </div>
            <div className="menudivider"></div> */}
            <div className="menuElement">Arabic | English</div>
            <div className="menudivider"></div>
            <div className="menuElement">Dark | Light</div>
            <div className="menudivider"></div>
            <button className="menuElement logout" onClick={logout}>Log out</button>
        </div>
    )
}