import React, { useContext, useState } from 'react';
import { SessionContext } from '../Contexts/SessionContext';


export default function UseTest() {

    const {activeSession, setActiveSession}= useContext(SessionContext);

    const obj = {nom: "yama", prenom:"kyu"} ;
    const [myTest, setMyTest] = useState(obj);
    
    let changeUseState = () => {
        console.log("calling changeUseState");

        let monSuperObjet = {
            nom: "mayaki",
            prenom: "abdoul",
            age:9,
            active: true
        };

        //setMyTest(monSuperObjet);
        setActiveSession(monSuperObjet);
    }
    
    
    let displayUseState = () => {
        console.log("calling displayUseState");
        console.log(activeSession);
    }

    

    return (
        <div>

            <button onClick={changeUseState}>Change useState</button>
            <button onClick={displayUseState}>Afficher useState</button>

        </div>
    )
    
}
