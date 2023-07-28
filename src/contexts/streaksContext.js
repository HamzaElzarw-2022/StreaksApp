
import { createContext, useReducer } from "react";

export const streaksContext = createContext([])

export function StreaksProvider({ children }) {

    const [streaks, streaksDispatch] = useReducer(streaksReducer, []);  
    const [expiredStreaks, expiredDispatch] = useReducer(expiredReducer, []);
    
    return(
        <streaksContext.Provider value={{streaks, streaksDispatch, expiredStreaks, expiredDispatch}}>
            { children }
        </streaksContext.Provider>
    )
}

function streaksReducer(streaks, action) 
{
    
    switch (action.type) { 
        case 'add' : 
        {
            return [ ...streaks, action.streak ]
        }
        case 'increment' : 
        {
            return streaks.map((streak) => {
                if(streak._id === action._id) {
                    streak.count++;
                    streak.done = true;
                }
                return streak;
            })
        }
        case 'updateRound' : 
        {
            return streaks.map((streak) => {
                if(streak._id === action._id) {
                    streak.roundEnd = action.newDeadline;
                    streak.done = false;
                }
                return streak;
            })
        }
        case 'remove' : 
        {
            return streaks.filter((streak) => {
                if(streak._id === action._id) {
                    return false;
                }
                return true;
            })
        }
        default : {
            console.log("invalid streaks reducer action type was called: " + action.type)
            return streaks;
        }
    }

}

export function expiredReducer(streaks, action) 
{
    switch (action.type) {
        case 'add' : 
        {
            return [ ...streaks, action.streak ]
        }
        case 'remove' : 
        {
            return streaks.filter((streak)=> {
                if(action._id === streak._id)
                    return false;
                return true
            })
        }
        default : {
            console.log("invalid expired streaks reducer action type was called: " + action.type)
            return streaks;
        }
    }
}