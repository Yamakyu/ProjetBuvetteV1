import React, {  useState, useContext } from 'react'
import Article from "./Article"
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../../Contexts/SessionContext'
import DoTheThings from './DoTheThings';

export default function TestDivers() {

    const {activeSession, isUserTokenExpired}= useContext(SessionContext);
    const myAppNavigator = useNavigate();

    const [file, setFile] = useState(undefined);

    const handleEditForm = inputEvent => {
        const { files } = inputEvent.target;
    
        console.log(files[0]);
        setFile(files[0]);
    }
    
    const displayFile = () => {
        console.log(file);
        
    }


    const apiSendPic = async () => {
        
        const formData = new FormData()
        //formData.append('file', file)
        //formData.append('api_key', "ZYF2QBCO84555782f94697373bbd48d8cf84902f")
        formData.append("firstName", "Yamakyu")
        formData.append("id", 26)

        axios.post("https://thronesapi.com/api/v2/Characters", formData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            }    
        })
        .then((reponse) => {
            console.log(reponse);
            console.log(reponse.data);
        })
        .catch((err) => console.log(err))

        return;

        await axios.post('/api/test/uploadPic', formData, {
            headers: {
              Authorization: "Bearer " + activeSession.userToken,
            }
          }).then((res) => {
            console.log("API response ↓");
            console.log(res);
      
          })
          .catch((err) => {
            console.log("API error ↓");
            console.log(err);

          });
          
          return;
    }


    //-------------------------------

    
    return (
        <div>
            <DoTheThings
                theThing={displayFile}
                theOtherThing={apiSendPic}
            />

            <Form>
                <Form.Group controlId="fileName">
                    <Form.Label className='VerticalLabel'>Photo ou image :</Form.Label> <br />
                    <Form.Control
                        className='LargeInput'
                        type="file"
                        name='image'
                        onChange={handleEditForm}
                        size="lg" 
                    />
                </Form.Group>
            </Form>
            <div className='APIResponse'>Faire les tests d'upload image</div>
        </div>
    )
}
