import { useContext } from "react";
import { userContext } from "../contexts/userContext";
import { streaksContext } from "../contexts/streaksContext";


export default function useLogout() {

    const {userDispatch} = useContext(userContext)
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
    }

    return {logout}
}