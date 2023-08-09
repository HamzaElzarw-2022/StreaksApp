
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/homePage.css";
import "../styles/mobile.css";
import NavBar from '../components/navBar';
import Content from '../components/content';
import NewStreakForm from '../components/newStreakForm.js';
import Menu from '../components/menu';
import { userContext } from '../contexts/userContext';
import { StreaksProvider} from '../contexts/streaksContext.js';
import plusIcon from '../icons/addIcon.png'

//main component that contain all components
export default function HomePage() {

    const {user} = useContext(userContext);
    const [menuVisible, setMenuVisible] = useState(false)
    const [formVisible, setFormVisible] = useState(false)

    const navigate = useNavigate()
    useEffect(()=> {
        if(!user)
            navigate("/login")
    }, [navigate, user])

    function menuVesibility() {
        setMenuVisible(!menuVisible)
    }
    function formVesibility() {
        setFormVisible(!formVisible)
    }

    return (
        <div>
            <NavBar formVesibility={formVesibility} menuVesibility={menuVesibility}/>
            <StreaksProvider>
                <NewStreakForm formVesibility={formVesibility} formVisible={formVisible}/>
                <Menu menuVisible={menuVisible}/>
                <button className="newStreakButtonMobile" type="button" onClick={formVesibility}><img className="plusIcon"src={plusIcon} alt="add"/>New Streak</button>
                <Content />
            </StreaksProvider>
        </div>
    );
}





