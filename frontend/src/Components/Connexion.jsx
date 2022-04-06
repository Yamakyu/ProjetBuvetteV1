import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../Contexts/SessionContext';


export default function Connexion() {

    const {activeSession, setActiveSession}= useContext(SessionContext);
    
    const myAppNavigator = useNavigate();

    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const submitForm = (formEvent) => {
        formEvent.preventDefault();
        
        console.log(email);
        console.log(password);

        //Envoi à notre API back end
        fetch("/api/users/login",{
            method: "POST",
            headers:{"Content-type" : "application/json"},
            body: JSON.stringify({email, password})
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data.message);
            console.log(data.user);
            console.log(`Le token (extreme) : ${data.newToken}`);
            
            let thatNewSession = {
                userInfo: data.user,
                userToken: data.newToken
            };

            localStorage.setItem('currentSession', JSON.stringify(thatNewSession));
            setActiveSession(thatNewSession);

            switch (thatNewSession.userInfo.droits) {
                case "admin":
                    myAppNavigator("/admin");
                    break;
                case "both":
                    myAppNavigator("/manage");
                    break;
                case "buvette":
                    myAppNavigator("/manage/buvette");
                    break;
                case "materiel":
                    myAppNavigator("/manage/materiel");
                    break;
                case "none":
                default:
                    myAppNavigator("/");
                    break;
            }

        })
        .catch((err) => console.log(err));

    }

    return (
        <div>

            <form onSubmit={submitForm}>
                <input type="email" value={email} placeholder='email' 
                onChange={(inputEvent) => setEmail(inputEvent.target.value)}/>

                <input type="text" value={login} placeholder='login' 
                onChange={(inputEvent) => setLogin(inputEvent.target.value)}/>
                
                <input type="password" value={password} placeholder='password' 
                onChange={(inputEvent) => setPassword(inputEvent.target.value)}/>
                <br />
                <br />

                <button>Connexion</button>
            </form>

        </div>
    )
    
}
