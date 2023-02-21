import React, { useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import { useState } from 'react'
import axios from 'axios'
import {userData} from '../components/storage/userData'
import {useNavigate} from 'react-router-dom'
import {languageData} from './storage/userData'
import {useTranslation} from 'react-i18next'

const Login = () => {

    const language = languageData(state=>state.language)
    const[alert, setAlert] = useState('')
    const loginData = userData((state)=> state.login)
    const navigate = useNavigate();
    const[t, i18n]= useTranslation("global");

    const send = async (e) =>{
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const peticion = await axios.post('http://localhost:3001/login', {email: email, password: password})

        if(peticion.data === 'notFound'){
            setAlert('error')
            setTimeout(() => {
                setAlert('')
            }, 2000);
        }else{
            loginData(peticion.data)
            navigate('/')
        }
    }

    useEffect(()=>{
        i18n.changeLanguage(language)
    },[language])

    return (
        <Container fluid='md'>
            {
                alert === 'error'
                ?
                <Alert variant='danger' className='mx-auto text-center' style={{position: 'absolute', left: '0', right: '0', width: '40%', marginTop: '-4rem'}}>Cuenta no encontrada</Alert>
                : ''
            }
            
            <Form className='text-center' onSubmit={send}>
                <Form.Group>
                    <Form.Label>{t("login.email")}</Form.Label>
                    <Form.Control id='email'/>
                    <Form.Label>{t("login.password")}</Form.Label>
                    <Form.Control id='password' type='password'/>
                </Form.Group>
                <Button type='Submit' className='mt-3'>{t("login.button")}</Button>
            </Form>
        </Container>
    )
}

export default Login