
import { createContext, useReducer, useEffect, useState } from "react";

export const userContext = createContext()

export function UserProvider({children}) {
    
    
    const [user, userDispatch] = useReducer(userReducer, null)

    useEffect( () => {
        
        const localUser = JSON.parse(localStorage.getItem('user'))
    
        if (localUser) {
            userDispatch({ type: 'login', user: localUser }) 
        }
        
    }, [])

    return(
        <userContext.Provider value= {{ user, userDispatch}}>
            {children}
        </userContext.Provider>
    )
}

function userReducer(user, action) {
    switch(action.type) {
        case 'login': {
            return action.user
        }
        case 'logout': {
            return null
        }
        default : {
            console.log("invalid user reducer action type was called: " + action.type)
            return user;
        }
    }
}