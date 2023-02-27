import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/Alert'
import axios from 'axios'
import {languageData} from './storage/userData'
import {useTranslation} from 'react-i18next'

const Registration = () => {

  const language = languageData(state =>state.language)
  const[alert, setAlert] = useState('');
  const[t, i18n] = useTranslation("global");

  const send = async (e) =>{
    e.preventDefault();

    const username = document.getElementById("username").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if(!username|| !name|| !email|| !password){
      setAlert('errorFill');
      setTimeout(()=>{
        setAlert('');
      }, 2000)
    }else{
      const peticion = await axios.post('https://react-wegram-production.up.railway.app/registration',{username: username, name: name, email: email, password: password})

      if(peticion.data === 'exists'){
        setAlert('exists');
        setTimeout(()=>{
          setAlert('');
        }, 2000)
      }else{
        setAlert('success');
        setTimeout(()=>{
          setAlert('');
        }, 2000)
      }
    }
  }

  useEffect(()=>{
    i18n.changeLanguage(language)
  },[])

  return (
    <Container className=' w-50'>
      {
        alert === 'errorFill'
        ?
          <Alert variant='danger' className='mx-auto text-center' style={{position: 'absolute', width: '300px', left: '0', right: '0', marginTop: '-4rem'}}>{t("alert.errorFill")}
          </Alert>
        : alert ==='exists'
        ? 
        <Alert variant='danger' className='mx-auto text-center' style={{position: 'absolute', left:'0', right
        :'0', width: '300px', marginTop:'-4rem'}}>{t("alert.errorEmail")}
        </Alert>
        : 
        alert ==='success'
        ? 
          <Alert variant='success' className='mx-auto text-center' style={{position: 'absolute', left:'0', right
        :'0', width: '300px', marginTop:'-4rem'}}>{t("alert.registered")}</Alert>
        :''
      }

      <Form className='text-center' onSubmit={send}>
        <Form.Group>
            <Form.Label>{t("signup.username")}</Form.Label>
            <Form.Control className='text-center' id='username'/>
            <Form.Label>{t("signup.name")}</Form.Label>
            <Form.Control className='text-center' id='name'/>
            <Form.Label>{t("signup.email")}</Form.Label>
            <Form.Control className='text-center' id='email'/>
            <Form.Label>{t("signup.password")}</Form.Label>
            <Form.Control className='text-center' id='password'/>
        </Form.Group>
        <Button type='Submit' className='mt-3'>{t("signup.button")}</Button>
    </Form>
    </Container>
  )
}

export default Registration