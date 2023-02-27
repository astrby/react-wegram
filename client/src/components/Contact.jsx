import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import emailjs from 'emailjs-com'
import Alert from 'react-bootstrap/Alert'
import {languageData} from './storage/userData'
import { useTranslation } from 'react-i18next'

const Contacto = () => {

  const language = languageData(state => state.language)
  const[t, i18n] = useTranslation("global");
  const[alert, setAlert] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if(!name || !email || !message){
      setAlert('errorFill')
      setTimeout(() => {
        setAlert('')
      }, 2000);
    }else{
      setAlert('sent')
      setTimeout(() => {
        setAlert('')
      }, 2000);
      emailjs.sendForm(process.env.REACT_APP_EMAILJS_SERVICE, process.env.REACT_APP_EMAILJS_TEMPLATE, e.target, process.env.REACT_APP_EMAILJS_KEY)
    }
  }

  useEffect(()=>{
    i18n.changeLanguage(language)
  },[])

  return (
    <Container>
      {
        alert === 'errorFill'
        ?
        <Alert variant='danger' className='mx-auto text-center' style={{position: 'absolute', left
      : '0', right:'0', width:'300px', marginTop: '-5rem'}}>{t("alert.errorFill")}</Alert>
        : alert === 'sent'
        ?<Alert variant='success' className='mx-auto text-center' style={{position: 'absolute', left
        : '0', right:'0', width:'300px', marginTop: '-5rem'}}>{t("alert.sent")}</Alert>
        :''
      }
      <h5 className='text-center'>{t("contact.comment")}</h5>
      <Form className='mt-5 text-center' onSubmit={handleSend}>
        <Form.Group>
          <Form.Label>{t("contact.name")}</Form.Label>
          <Form.Control className='text-center' id='name' name='name'/>
          <Form.Label className='mt-4'>{t("contact.email")}</Form.Label>
          <Form.Control className='text-center' id='email' name='email'/>
          <Form.Label className='mt-4'>{t("contact.message")}</Form.Label>
          <Form.Control className='text-center' as='textarea' id='message' name='message'/>
        </Form.Group>
        <Button type='Submit' className='mt-4'>{t("contact.button")}</Button>
      </Form>
    </Container>
  )
}

export default Contacto