import { useState, useEffect } from "react"

export default function useFormPosition(formVisible) {

    const [position, setPosition] = useState()
    useEffect(()=>{
        if(window.innerWidth < 600) {
            if(formVisible) 
                setPosition({
                    top: "50%",
                    right: "50%",
                    marginRight: "-150px",
                    marginTop: "-175px",
                    transition: "top 0.5s"
                })
            else 
                setPosition({
                    top: "-200px",
                    right: "50%",
                    marginRight: "-150px",
                    marginTop: "-175px",
                    transition: "top 0.5s"
                })
        }
        else {
            if(formVisible) 
                setPosition({
                    top: "87px",
                    right: "15px",
                    marginRight: "0px",
                    marginTop: "0px",
                    transition: "right 0.5s"
                })
            else 
                setPosition({
                    top: "87px",
                    right: "-310px",
                    marginRight: "0px",
                    marginTop: "0px",
                    transition: "right 0.5s"
                })
        }

    }, [formVisible])
    
    return { position };
}