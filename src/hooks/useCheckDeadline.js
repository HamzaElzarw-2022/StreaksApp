import { useContext } from "react"
import { userContext } from "../contexts/userContext";
import { streaksContext } from "../contexts/streaksContext";
import axios from "axios";

export default function useCheckDeadline(_id) {

    const {user} = useContext(userContext);
    const {streaksDispatch, expiredDispatch} = useContext(streaksContext)

    const checkDeadline = async() =>
    {
        const response = await axios.put(process.env.REACT_APP_PORT + '/streak/roundEnded', 
            { "id": _id },
            { headers: { Authorization: `Bearer ${user.token}`} }
        )
            
        if(response.data.status === true) {
            if(response.data.action === "active") 
                streaksDispatch({
                    type: 'updateRound',
                    newDeadline: response.data.newRoundEnd,
                    _id: _id
                })
            else {
                streaksDispatch({
                    type: 'remove',
                    _id: _id
                })
                expiredDispatch({
                    type: 'add',
                    streak: response.data.streak
                })

                document.getElementById("expiredContainer").style.height = (60 * document.getElementById("expiredContainer").childElementCount) + 70 + "px";
                // if(document.getElementById(_id).offsetHeight === 500) 
                //             currentlyExtendedStreak = "none";

                alert("\""+ response.data.streak.name + "\" has expired because " + response.data.message)
            }
        }
        else 
            alert(response.data.message) 
    }

    return { checkDeadline }
}