import React, {  useState, useContext } from 'react'
import axios from 'axios';
import { Form } from 'react-bootstrap'
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
        formData.append('file', file)
        formData.append('key', "6d207e02198a847aa98d0a2a901485a5")
        formData.append("firstName", "Yamakyu")
        formData.append("id", 26)    

        await axios.post('/api/test/upload', formData, {
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

        /*

        axios.post("https://freeimage.host/api/1/upload", formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
                Authorization: "Bearer " + activeSession.userToken,
            }    
        })
        .then((reponse) => {
            console.log(reponse);
            console.log(reponse.data);
        })
        .catch((err) => console.log(err))

        return;

        axios.post("https://httpbin.org/post", formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: "Bearer " + activeSession.userToken,
            }    
        })
        .then((reponse) => {
            console.log(reponse);
            console.log(reponse.data);
        })
        .catch((err) => console.log(err))

        return;

        await axios.post('/api/test/upload', formData, {
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
          */
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
