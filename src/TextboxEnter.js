import { useState } from 'react';

//First try 

export default function Main() {
    
    const [mylist] = useState([]);

    return (
        <div>
            <Myinput  list={mylist} />
            <Myoutput   list={mylist} />
        </div>
    );
}

function Myinput({ list }) {

    const [mytext, setmytext] = useState("");

    function onbuttonclick() {
        list.push(
                <li key={list.length} ><h3>{mytext}</h3></li>
        );
        console.log(list);
    }

    return (
        <form>
            <input type="text" value={mytext}  onChange={(e) => {setmytext(e.target.value)}}/>
            <button type="button" onClick={onbuttonclick}>click mee</button>
        </form>
    );
}

function Myoutput({ list}) {

    return (
        <div>
            <ul>{list}</ul>
        </div>
    )
}

