import React from 'react'
import {useNavigate} from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import {userData} from '../components/storage/userData'
import Alert from 'react-bootstrap/Alert'
import axios from 'axios'
import { useState } from 'react'
import {storage} from './storage/FireBase'
import {ref, getDownloadURL, uploadBytes} from 'firebase/storage'

const CreatePost = () => {
    
    const loginData = userData((state)=>state.user)
    const[alert, setAlert] = useState('')
    const navigate = useNavigate()

    const send = async(e) =>{

        e.preventDefault();
        const description = document.getElementById('description').value
        const userId = loginData[0].id;
        const username = loginData[0].username;
        const img = document.getElementById('img').files[0]

        if(!description || !img){
            setAlert('error')
            setTimeout(() => {
                setAlert('')
            }, 3000);
        }else{
            setAlert('sent')
            setTimeout(() => {
                setAlert('')
                navigate('/');
            }, 2000);

            const storageRef = ref(storage, `wegram/users/${userId}/imgPosts/${Date.now()+'_'+img.name}`)
            
            uploadBytes(storageRef, img).then((snapshot)=>{
                getDownloadURL(snapshot.ref).then(async(urlImage)=>{
                    await axios.post("https://react-wegram.vercel.app/createPost", {description: description, userId: userId, username: username, urlImage: urlImage})
                })
            })
        }
    }

    return (
    <Container className='text-center'>
        {
            alert === 'error'
            ?
            <Alert variant='danger' className='mx-auto' style={{position: 'absolute', width: '45%', left:'0', right:'0', marginTop:'-5rem'}}>Error. Debe llenar el campo de descripción y subir una imagen.</Alert>
            : alert === 'sent'
            ?
            <Alert variant='success' className='mx-auto' style={{position: 'absolute', width: '45%', left:'0', right:'0', marginTop:'-5rem'}}>Publicación creada.</Alert>
            :''
        }
        <Form className='mt-5'>
            <Form.Group>
                <Form.Label>Descripción</Form.Label>
                <Form.Control as='textarea' id='description'/>
                <Form.Label className='pt-3'>Imagen</Form.Label>
                <Form.Control type='file' id='img'/>
            </Form.Group>
        </Form>
        <Button className='mt-4' onClick={send}>Publicar</Button>
    </Container>
    )
}

export default CreatePost