import hamburgerMune from "../icons/HamburgerMenu.svg"
import fireIcon from "../icons/fire.png"

export default function NavBar({formVesibility, menuVesibility}) {

    return (
        <div className= "navBar">
            <img className="hamburgerMenu" src={hamburgerMune} alt="menu" onClick={menuVesibility}/>
            <div className="homeHead">
                <img className="logo" src={fireIcon} alt="logo" />
                <div className="title">Streaks</div> 
            </div>
            <button className="newStreakButton" type="button" onClick={formVesibility} >➕New Streak</button>
        </div>
    );
}