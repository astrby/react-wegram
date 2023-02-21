import React from 'react'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form'
import {userData} from './storage/userData'
import {storage} from './storage/FireBase'
import {ref, getDownloadURL, uploadBytes} from 'firebase/storage'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { languageData } from './storage/userData'
import { useTranslation } from 'react-i18next'

const Profile = () => {

    const language = languageData(state=>state.language);
    const[t, i18n] = useTranslation("global");
    const loginData = userData(state=>state.user);
    const loginChange = userData((state)=> state.login)
    const[user, setUser] = useState([])
    const [imgSrc, setImgSrc] = useState('');
    const storageRef = ref(storage, `wegram/users/${loginData[0].id}/profilePic/profilePic.jpg`)

    const handleImg = (e) =>{
        console.log(loginData[0].id)
        e.preventDefault()
        const img = document.getElementById('img').files[0];

        uploadBytes(storageRef, img);

        window.location.reload();
    }

    const handleSave = async(e) =>{
        e.preventDefault();

        const username = document.getElementById('username').value;
        const name = document.getElementById('name').value;

        if(user.username !== username && username !== ''){
            loginChange({...user, username: username})
        }

        if(user.name !== name && name !== ''){
            loginChange({...user, name: name})
        }
        
        await axios.post('http://localhost:3001/editProfile', {
        id: loginData[0].id, username: username, name: name});

    }

    useEffect(()=>{
        i18n.changeLanguage(language)
        setUser(loginData[0])

        getDownloadURL(storageRef).then((url)=>{
            setImgSrc(url)
        }).catch(error=>{console.log(error)})
        
        
    },[])

  return (
    <Container className='text-center'>
        <Form fluid='ms' onSubmit={handleSave}>
            <h5>{t("profile.profile")}</h5>
            <Image className='mt-4' src={imgSrc} style={{borderRadius: '50%', width: '10rem', height: '10rem'}}/>
            <Form.Group className='mt-5'>
                <Form.Text>{t("profile.change")}</Form.Text>
                <Form.Control type='file' onChange={handleImg} id='img'/>
            </Form.Group>
            <Form.Group className='mt-4'>
                <Form.Text className='mt-5' style={{fontWeight: 'bold'}}>{t("profile.username")}</Form.Text>
                <Form.Control type='text' placeholder={loginData[0].username} className='rounded text-center' id='username' defaultValue={loginData[0].username}/>
                <Form.Text className='mt-5'  style={{fontWeight: 'bold'}}>{t("profile.name")}</Form.Text>
                <Form.Control className='text-center' type='text' placeholder={loginData[0].name} id='name' defaultValue={loginData[0].name}/>
            </Form.Group>
            <Button type='Submit' className='mt-4'>{t("profile.button")}</Button>
        </Form>
    </Container>
  )
}

export default Profile